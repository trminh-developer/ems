import { Request, Response } from 'express';
import { AuthRequest } from '../../../../middlewares/authMiddleware';
import { PREMIUM_PLANS } from '../../domain/PremiumPlans';
import { sePayAvailable, getSePayConfig } from '../../infrastructure/sepayConfig';
import { BankGateway } from '../../infrastructure/gateways/BankGateway';
import { SequelizeTransactionRepository } from '../../infrastructure/repositories/SequelizeTransactionRepository';
import { bankPaymentMode, bankReference } from '../../infrastructure/directBankConfig';
import { Transaction, User } from '../../../../models';
import { Op } from 'sequelize';
import { datingTransaction } from '../../../match/transactions';

export class BankPaymentController {
  private repository = new SequelizeTransactionRepository();
  private gateway = new BankGateway();

  methods = async (_req: Request, res: Response) => {
    const live = process.env.PAYMENT_MODE === 'production';
    const present = (key: string) => Boolean(process.env[key]?.trim()) && !/^(MOMO_TEST|YOUR_|CHANGE_ME)/i.test(process.env[key]!);
    const direct = bankPaymentMode() === 'direct';
    const bank = direct || sePayAvailable();
    return res.json({
      environment: direct ? 'production' : bank ? getSePayConfig().env : null,
      confirmationMode: direct ? 'manual' : 'automatic',
      methods: {
        bank,
        momo: live && ['MOMO_PARTNER_CODE', 'MOMO_ACCESS_KEY', 'MOMO_SECRET_KEY'].every(present) && !process.env.MOMO_ENDPOINT?.includes('test-payment'),
        card: live && Boolean(process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_')),
        paypal: live && ['PAYPAL_CLIENT_ID', 'PAYPAL_SECRET'].every(present),
      },
      plans: Object.entries(PREMIUM_PLANS).map(([id, plan]) => ({ id, ...plan })),
    });
  };

  details = async (req: AuthRequest, res: Response) => {
    try {
      const tx = await this.repository.findById(req.params.orderId as string);
      if (!tx || tx.userId !== req.user.id || tx.provider !== 'BANK') return res.status(404).json({ error: 'Không tìm thấy đơn chuyển khoản.' });
      return res.json({
        orderId: tx.id, planId: tx.planId, amount: tx.amount, status: tx.status,
        checkout: tx.status === 'PENDING' ? this.gateway.checkout(tx) : null,
        transfer: tx.paymentDetails?.mode === 'direct' ? tx.paymentDetails : null,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({ error: error.statusCode ? error.message : 'Không thể tải thông tin chuyển khoản.' });
    }
  };

  submit = async (req: AuthRequest, res: Response) => {
    try {
      const reference = bankReference(req.body?.reference);
      const result = await datingTransaction(async transaction => {
        const tx: any = await Transaction.findOne({ where: { id: req.params.orderId, user_id: req.user.id, provider: 'BANK' }, transaction, lock: transaction.LOCK.UPDATE });
        if (!tx || tx.payment_details?.mode !== 'direct') throw Object.assign(new Error('Không tìm thấy đơn chuyển khoản trực tiếp.'), { statusCode: 404 });
        if (tx.status !== 'PENDING') return { status: tx.status };
        const submission = { reference, submittedAt: new Date().toISOString() };
        await tx.update({ payment_details: { ...tx.payment_details, submission } }, { transaction });
        return { status: 'PENDING', submission };
      });
      return res.json(result);
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({ error: error.statusCode ? error.message : 'Chưa gửi được thông tin chuyển khoản.' });
    }
  };

  pending = async (req: AuthRequest, res: Response) => {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Chỉ quản trị viên được đối soát thanh toán.' });
    try {
      const page = Math.max(1, Math.min(10000, Math.floor(Number(req.query.page) || 1)));
      const pageSize = Math.max(1, Math.min(50, Math.floor(Number(req.query.pageSize) || 10)));
      const where = { provider: 'BANK', status: 'PENDING', 'payment_details.mode': 'direct', 'payment_details.submission.reference': { [Op.ne]: null } };
      const { rows, count } = await Transaction.findAndCountAll({ where, order: [['created_at', 'ASC'], ['id', 'ASC']], limit: pageSize, offset: (page - 1) * pageSize });
      const users = rows.length ? await User.findAll({ where: { id: { [Op.in]: rows.map(row => row.get('user_id') as string) } }, attributes: ['id', 'username', 'first_name', 'last_name', 'email', 'avatar'] }) : [];
      const byId = new Map(users.map(user => [user.get('id'), user.toJSON()]));
      return res.json({ items: rows.map(row => ({ ...row.toJSON(), user: byId.get(row.get('user_id')) || null })), page, pageSize, total: count, totalPages: Math.max(1, Math.ceil(count / pageSize)) });
    } catch {
      return res.status(500).json({ error: 'Không thể tải các đơn chờ đối soát.' });
    }
  };

  confirm = async (req: AuthRequest, res: Response) => {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Chỉ quản trị viên được đối soát thanh toán.' });
    try {
      const tx = await this.repository.findById(req.params.orderId as string);
      if (!tx || tx.provider !== 'BANK' || tx.paymentDetails?.mode !== 'direct') return res.status(404).json({ error: 'Không tìm thấy đơn chuyển khoản trực tiếp.' });
      const reference = bankReference(req.body?.reference);
      if (req.body?.verified !== true || !Number.isInteger(req.body?.amount) || req.body.amount !== tx.amount) {
        return res.status(400).json({ error: 'Cần đối chiếu người chuyển, mã giao dịch và đúng số tiền đã vào tài khoản BIDV.' });
      }
      await this.repository.settle(tx.id, 'SUCCESS', { reference: 'direct:BIDV:' + reference, confirmedBy: req.user.id, amount: req.body.amount });
      return res.json({ orderId: tx.id, status: 'SUCCESS' });
    } catch (error: any) {
      if (error.name === 'SequelizeUniqueConstraintError') return res.status(409).json({ error: 'Mã giao dịch ngân hàng đã được dùng cho đơn khác.' });
      return res.status(error.statusCode || 500).json({ error: error.statusCode ? error.message : 'Không thể xác nhận chuyển khoản.' });
    }
  };
}
