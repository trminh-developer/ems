import { ITransactionRepository } from '../../application/ports/ITransactionRepository';
import { Transaction as DomainTransaction } from '../../domain/entities/Transaction';
import { sequelize, Transaction, User } from '../../../../models';
import { extendPremium, getPremiumPlan } from '../../domain/PremiumPlans';

export class SequelizeTransactionRepository implements ITransactionRepository {
  async save(tx: DomainTransaction): Promise<void> {
    await Transaction.create({
      id: tx.id, user_id: tx.userId, plan_id: tx.planId, amount: tx.amount,
      status: tx.status, provider: tx.provider, created_at: tx.createdAt,
    });
  }

  async findById(id: string): Promise<DomainTransaction | null> {
    const data: any = await Transaction.findByPk(id);
    return data ? new DomainTransaction(data.id, data.user_id, data.plan_id,
      data.amount, data.status, data.provider, new Date(data.created_at)) : null;
  }

  async settle(id: string, status: 'SUCCESS' | 'FAILED'): Promise<void> {
    await sequelize.transaction(async (transaction) => {
      const tx: any = await Transaction.findByPk(id, { transaction, lock: transaction.LOCK.UPDATE });
      if (!tx) throw new Error('Không tìm thấy giao dịch.');
      // Successful orders are immutable, even on retries or late failure callbacks.
      if (tx.status === 'SUCCESS') return;
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
      await tx.update({ status }, { transaction });
    });
  }
}
