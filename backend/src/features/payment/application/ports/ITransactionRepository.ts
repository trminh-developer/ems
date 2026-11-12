import { Transaction } from "../../domain/entities/Transaction";
import type { PaymentReceipt } from '../../domain/BankTransfer';

export interface ITransactionRepository {
  save(transaction: Transaction): Promise<void>;
  settle(id: string, status: "SUCCESS" | "FAILED", receipt?: PaymentReceipt): Promise<void>;
  findById(id: string): Promise<Transaction | null>;
}
