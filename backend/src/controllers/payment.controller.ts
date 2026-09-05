import { Request, Response } from 'express';
import { createVNPayUrl, verifyVNPayReturn } from '../services/vnpay.service';
import { createMoMoUrl, verifyMoMoSignature } from '../services/momo.service';

export const createVNPayPayment = (req: Request, res: Response) => {
  try {
    const { orderId, amount, description } = req.body;
    
    // Get client IP
    const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    
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

export const vnpayReturn = (req: Request, res: Response) => {
  try {
    const vnp_Params = req.query;
    const isValid = verifyVNPayReturn(vnp_Params);
    const orderId = vnp_Params['vnp_TxnRef'];
    const responseCode = vnp_Params['vnp_ResponseCode'];

    if (isValid) {
      if (responseCode === '00') {
        console.log(`[PAYMENT] VNPay SUCCESS: ${orderId}`);
        // TODO: Lưu vào Database status = SUCCESS
      } else {
        console.log(`[PAYMENT] VNPay FAILED: ${orderId} with code ${responseCode}`);
        // TODO: Lưu vào Database status = FAILED
      }
    } else {
      console.log(`[PAYMENT] Signature mismatch for VNPay: ${orderId}`);
    }

    res.json({ success: isValid, responseCode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

export const createMoMoPayment = async (req: Request, res: Response) => {
  try {
    const { orderId, amount, description } = req.body;
    
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

export const momoIpn = (req: Request, res: Response) => {
  try {
    const data = req.body;
    const isValid = verifyMoMoSignature(data);
    const orderId = data.orderId;

    if (isValid) {
      if (data.resultCode === 0) {
        console.log(`[PAYMENT] MoMo SUCCESS: ${orderId}`);
        // TODO: Lưu vào Database
      } else {
        console.log(`[PAYMENT] MoMo FAILED: ${orderId}`);
      }
      return res.status(200).json({ message: 'Received' }); // MoMo yêu cầu trả về HTTP 200
    } else {
      console.log(`[PAYMENT] Signature mismatch for MoMo: ${orderId}`);
      return res.status(400).json({ message: 'Invalid signature' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
