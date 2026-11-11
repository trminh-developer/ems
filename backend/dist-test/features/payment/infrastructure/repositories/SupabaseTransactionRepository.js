"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseTransactionRepository = void 0;
const Transaction_1 = require("../../domain/entities/Transaction");
const supabase_1 = require("../../../../utils/supabase");
class SupabaseTransactionRepository {
  async save(tx) {
    const { error } = await supabase_1.supabaseAdmin
      .from("transactions")
      .insert({
        id: tx.id,
        user_id: tx.userId,
        plan_id: tx.planId,
        amount: tx.amount,
        status: tx.status,
        provider: tx.provider,
        created_at: tx.createdAt.toISOString(),
      });
    if (error) console.error("Lỗi lưu transaction:", error);
  }
  async updateStatus(id, status) {
    await supabase_1.supabaseAdmin
      .from("transactions")
      .update({ status })
      .eq("id", id);
  }
  async findById(id) {
    const { data, error } = await supabase_1.supabaseAdmin
      .from("transactions")
      .select("*")
      .eq("id", id)
      .single();
    if (error || !data) return null;
    return new Transaction_1.Transaction(
      data.id,
      data.user_id,
      data.plan_id,
      data.amount,
      data.status,
      data.provider,
      new Date(data.created_at),
    );
  }
  async upgradeUserPremium(userId, planId) {
    const months = planId === "12_months" ? 12 : planId === "6_months" ? 6 : 1;
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + months);
    const { error } = await supabase_1.supabaseAdmin
      .from("users")
      .update({
        is_premium: true,
        premium_expires_at: expiresAt.toISOString(),
      })
      .eq("id", userId);
    if (error) console.error("Lỗi cập nhật Premium:", error);
    else console.log(`[DB UPDATE] Đã nâng cấp Premium cho user: ${userId}`);
  }
}
exports.SupabaseTransactionRepository = SupabaseTransactionRepository;
