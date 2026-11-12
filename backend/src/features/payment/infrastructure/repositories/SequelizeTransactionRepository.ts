import { ITransactionRepository } from '../../application/ports/ITransactionRepository';
import { Transaction as DomainTransaction } from '../../domain/entities/Transaction';
import { Transaction, User } from '../../../../models';
import { datingTransaction as paymentTransaction } from '../../../match/transactions';
import { extendPremium, getPremiumPlan } from '../../domain/PremiumPlans';
import type { PaymentReceipt } from '../../domain/BankTransfer';

export class SequelizeTransactionRepository implements ITransactionRepository {
  async save(tx: DomainTransaction): Promise<void> {
    await Transaction.create({
      id: tx.id, user_id: tx.userId, plan_id: tx.planId, amount: tx.amount,
      status: tx.status, provider: tx.provider, created_at: tx.createdAt, payment_details: tx.paymentDetails ?? null,
    });
  }

  async findById(id: string): Promise<DomainTransaction | null> {
    const data: any = await Transaction.findByPk(id);
    return data ? new DomainTransaction(data.id, data.user_id, data.plan_id,
      data.amount, data.status, data.provider, new Date(data.created_at), data.payment_details ?? undefined) : null;
  }

  async settle(id: string, status: 'SUCCESS' | 'FAILED', receipt?: PaymentReceipt): Promise<void> {
    await paymentTransaction(async (transaction) => {
      const tx: any = await Transaction.findByPk(id, { transaction, lock: transaction.LOCK.UPDATE });
      if (!tx) throw new Error('Không tìm thấy giao dịch.');
      if (status === 'SUCCESS' && tx.provider === 'BANK') {
        if (!receipt?.reference) throw new Error('Thiếu mã giao dịch ngân hàng đã đối soát.');
        if (tx.payment_details?.mode === 'direct' && (!receipt.confirmedBy || receipt.amount !== tx.amount)) {
          throw Object.assign(new Error('Cần quản trị viên đối soát đúng số tiền nhận được.'), { statusCode: 400 });
        }
      }
      // Successful orders are immutable, even on retries or late failure callbacks.
      if (tx.status === 'SUCCESS') {
        if (receipt && tx.provider_reference !== receipt.reference) throw Object.assign(new Error('Đơn đã được xác nhận bằng giao dịch khác.'), { statusCode: 409 });
        return;
      }
      if (status === 'SUCCESS') {
        const user: any = await User.findByPk(tx.user_id, { transaction, lock: transaction.LOCK.UPDATE });
        if (!user) throw new Error('Không tìm thấy người mua.');
        const plan = getPremiumPlan(tx.plan_id);
        await user.update({
          is_premium: true,
          premium_plan_id: tx.plan_id,
          premium_expires_at: extendPremium(user.premium_expires_at, plan.months),
        }, { transaction });
      }
      // Entitlement and payment status commit together or both roll back.
      await tx.update({ status, ...(receipt ? { provider_reference: receipt.reference, confirmed_by: receipt.confirmedBy ?? null } : {}),
        ...(status === 'SUCCESS' ? { paid_at: new Date() } : {}),
      }, { transaction });
    });
  }
}
