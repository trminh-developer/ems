import { Transaction } from '../../domain/entities/Transaction';

export interface ITransactionRepository {
  save(transaction: Transaction): Promise<void>;
  updateStatus(id: string, status: 'SUCCESS' | 'FAILED'): Promise<void>;
  findById(id: string): Promise<Transaction | null>;
  upgradeUserPremium(userId: string, planId: string): Promise<void>;
}
