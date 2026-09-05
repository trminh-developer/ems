import { Request, Response } from 'express';
import { createVNPayUrl, verifyVNPayReturn } from '../services/vnpay.service';
import { createMoMoUrl, verifyMoMoSignature } from '../services/momo.service';
import { supabaseAdmin } from '../utils/supabase';

// Helper function to update DB on success
const handleSuccessfulPayment = async (orderId: string, amount: number) => {
  try {
    // 1. Get userId and planId from orderId (Assuming format: ORD_1MONTH_USER123_RANDOM)
    // Hoặc query order từ DB. Ở đây tạm thời ta lưu orderId và trạng thái
    console.log(`[DB UPDATE] Ghi nhận giao dịch ${orderId} thành công`);
    
    // Cập nhật trạng thái giao dịch trong bảng transactions
    const { error: txError } = await supabaseAdmin.from('transactions').update({
      status: 'SUCCESS',
    }).eq('id', orderId);
    
    // Query to get user_id and plan_id from the transaction
    const { data: txData, error: txFetchError } = await supabaseAdmin
      .from('transactions')
      .select('user_id, plan_id')
      .eq('id', orderId)
      .single();

    if (txData && txData.user_id) {
      // Calculate expiration date
      const months = txData.plan_id === '12_months' ? 12 : txData.plan_id === '6_months' ? 6 : 1;
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + months);

      // Update user premium status
      const { error: userError } = await supabaseAdmin
        .from('users')
        .update({ 
          is_premium: true,
          premium_expires_at: expiresAt.toISOString()
        })
        .eq('id', txData.user_id);
        
      if (userError) console.error('Lỗi cập nhật Premium user:', userError);
      else console.log(`[DB UPDATE] Đã nâng cấp Premium cho user: ${txData.user_id}`);
    }
    
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const createVNPayPayment = (req: Request, res: Response) => {
  try {
    const { orderId, amount, description, userId, planId } = req.body;
    
    const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    
    // Lưu nháp (PENDING) vào DB
    supabaseAdmin.from('transactions').insert({
      id: orderId,
      user_id: userId,
      plan_id: planId,
      amount: amount,
      status: 'PENDING',
      provider: 'VNPAY',
    }).then();

    const paymentUrl = createVNPayUrl(
      orderId, 
      amount, 
      description || `Thanh toan don hang ${orderId}`, 
      ipAddr as string
    );

    console.log(`[PAYMENT] Creating VNPay payment: ${orderId} - ${amount} VND`);

    res.json({
      success: true,
      provider: 'vnpay',
      paymentUrl,
      transactionId: orderId
    });
  } catch (error) {
    console.error('Error creating VNPay:', error);
    res.status(500).json({ success: false, message: 'Lỗi tạo thanh toán VNPay' });
  }
};

export const vnpayReturn = async (req: Request, res: Response) => {
  try {
    const vnp_Params = req.query;
    const isValid = verifyVNPayReturn(vnp_Params);
    const orderId = vnp_Params['vnp_TxnRef'] as string;
    const responseCode = vnp_Params['vnp_ResponseCode'];
    const amountStr = vnp_Params['vnp_Amount'] as string;
    const amount = parseInt(amountStr) / 100;

    if (isValid) {
      if (responseCode === '00') {
        console.log(`[PAYMENT] VNPay SUCCESS: ${orderId}`);
        await handleSuccessfulPayment(orderId, amount);
      } else {
        console.log(`[PAYMENT] VNPay FAILED: ${orderId} with code ${responseCode}`);
        await supabaseAdmin.from('transactions').update({ status: 'FAILED' }).eq('id', orderId);
      }
    } else {
      console.log(`[PAYMENT] Signature mismatch for VNPay: ${orderId}`);
    }

    // Redirect user back to frontend UI instead of returning JSON
    res.redirect(`http://localhost:5173/payment/result?orderId=${orderId}&status=${responseCode === '00' ? 'success' : 'failed'}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Lỗi máy chủ');
  }
};

export const createMoMoPayment = async (req: Request, res: Response) => {
  try {
    const { orderId, amount, description, userId, planId } = req.body;
    
    // Lưu nháp (PENDING) vào DB
    supabaseAdmin.from('transactions').insert({
      id: orderId,
      user_id: userId,
      plan_id: planId,
      amount: amount,
      status: 'PENDING',
      provider: 'MOMO',
    }).then();

    const result = await createMoMoUrl(
      orderId, 
      amount, 
      description || `Thanh toan don hang ${orderId}`
    );

    console.log(`[PAYMENT] Creating MoMo payment: ${orderId} - ${amount} VND`);

    if (result.payUrl) {
      res.json({
        success: true,
        provider: 'momo',
        paymentUrl: result.payUrl,
        transactionId: orderId
      });
    } else {
      res.status(400).json({ success: false, message: result.message || 'Lỗi từ MoMo' });
    }
  } catch (error) {
    console.error('Error creating MoMo:', error);
    res.status(500).json({ success: false, message: 'Lỗi tạo thanh toán MoMo' });
  }
};

export const momoIpn = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const isValid = verifyMoMoSignature(data);
    const orderId = data.orderId;
    const amount = data.amount;

    if (isValid) {
      if (data.resultCode === 0) {
        console.log(`[PAYMENT] MoMo SUCCESS: ${orderId}`);
        await handleSuccessfulPayment(orderId, amount);
      } else {
        console.log(`[PAYMENT] MoMo FAILED: ${orderId}`);
        await supabaseAdmin.from('transactions').update({ status: 'FAILED' }).eq('id', orderId);
      }
      return res.status(200).json({ message: 'Received' });
    } else {
      console.log(`[PAYMENT] Signature mismatch for MoMo: ${orderId}`);
      return res.status(400).json({ message: 'Invalid signature' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
