export class Transaction {
  constructor(
    public id: string,
    public userId: string,
    public planId: string,
    public amount: number,
    public status: "PENDING" | "SUCCESS" | "FAILED",
    public provider: "VNPAY" | "MOMO" | "CARD" | "PAYPAL" | string,
    public createdAt: Date,
  ) {}
}
