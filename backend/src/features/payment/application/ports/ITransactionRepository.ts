import { Transaction } from "../../domain/entities/Transaction";

export interface ITransactionRepository {
  save(transaction: Transaction): Promise<void>;
  settle(id: string, status: "SUCCESS" | "FAILED"): Promise<void>;
  findById(id: string): Promise<Transaction | null>;
}
