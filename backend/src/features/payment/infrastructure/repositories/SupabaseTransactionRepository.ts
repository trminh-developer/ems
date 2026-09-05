import { ITransactionRepository } from '../../application/ports/ITransactionRepository';
import { Transaction } from '../../domain/entities/Transaction';
import { supabaseAdmin } from '../../../../utils/supabase';

export class SupabaseTransactionRepository implements ITransactionRepository {
  async save(tx: Transaction): Promise<void> {
    const { error } = await supabaseAdmin.from('transactions').insert({
      id: tx.id,
      user_id: tx.userId,
      plan_id: tx.planId,
      amount: tx.amount,
      status: tx.status,
      provider: tx.provider,
      created_at: tx.createdAt.toISOString()
    });
    if (error) console.error('Lỗi lưu transaction:', error);
  }

  async updateStatus(id: string, status: 'SUCCESS' | 'FAILED'): Promise<void> {
    await supabaseAdmin.from('transactions').update({ status }).eq('id', id);
  }

  async findById(id: string): Promise<Transaction | null> {
    const { data, error } = await supabaseAdmin.from('transactions').select('*').eq('id', id).single();
    if (error || !data) return null;
    return new Transaction(data.id, data.user_id, data.plan_id, data.amount, data.status, data.provider, new Date(data.created_at));
  }

  async upgradeUserPremium(userId: string, planId: string): Promise<void> {
    const months = planId === '12_months' ? 12 : planId === '6_months' ? 6 : 1;
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + months);
    
    const { error } = await supabaseAdmin.from('users').update({ 
      is_premium: true,
      premium_expires_at: expiresAt.toISOString()
    }).eq('id', userId);
    
    if (error) console.error('Lỗi cập nhật Premium:', error);
    else console.log(`[DB UPDATE] Đã nâng cấp Premium cho user: ${userId}`);
  }
}