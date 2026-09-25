import { ITransactionRepository } from '../../application/ports/ITransactionRepository';
import { Transaction as DomainTransaction } from '../../domain/entities/Transaction';
import { Transaction, User } from '../../../../models';

export class SequelizeTransactionRepository implements ITransactionRepository {
  async save(tx: DomainTransaction): Promise<void> {
    try {
      await Transaction.create({
        id: tx.id,
        user_id: tx.userId,
        plan_id: tx.planId,
        amount: tx.amount,
        status: tx.status,
        provider: tx.provider,
        created_at: tx.createdAt
      });
    } catch (error) {
      console.error('Lỗi lưu transaction:', error);
    }
  }

  async updateStatus(id: string, status: 'SUCCESS' | 'FAILED'): Promise<void> {
    try {
      await Transaction.update({ status }, { where: { id } });
    } catch (error) {
      console.error('Lỗi cập nhật transaction status:', error);
    }
  }

  async findById(id: string): Promise<DomainTransaction | null> {
    try {
      const data: any = await Transaction.findByPk(id);
      if (!data) return null;
      return new DomainTransaction(
        data.id, 
        data.user_id, 
        data.plan_id, 
        data.amount, 
        data.status, 
        data.provider, 
        new Date(data.created_at)
      );
    } catch (error) {
      console.error('Lỗi tìm transaction:', error);
      return null;
    }
  }

  async upgradeUserPremium(userId: string, planId: string): Promise<void> {
    try {
      const months = planId === '12_months' ? 12 : planId === '6_months' ? 6 : 1;
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + months);
      
      await User.update({ 
        is_premium: true,
        premium_expires_at: expiresAt
      }, { where: { id: userId } });
      
      console.log(`[DB UPDATE] Đã nâng cấp Premium cho user: ${userId}`);
    } catch (error) {
      console.error('Lỗi cập nhật Premium:', error);
    }
  }
}
