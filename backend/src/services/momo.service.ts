import crypto from 'crypto';
import axios from 'axios';

export const createMoMoUrl = async (
  orderId: string, 
  amount: number, 
  orderInfo: string
) => {
  const accessKey = process.env.MOMO_ACCESS_KEY || '';
  const secretKey = process.env.MOMO_SECRET_KEY || '';
  const partnerCode = process.env.MOMO_PARTNER_CODE || '';
  const redirectUrl = process.env.MOMO_REDIRECT_URL || 'http://localhost:5173/payment/result';
  const ipnUrl = process.env.MOMO_IPN_URL || 'https://YOUR_NGROK_URL/api/payments/momo/ipn';
  
  // Tự động chuyển đổi URL dựa trên biến PAYMENT_MODE
  const isProd = process.env.PAYMENT_MODE === 'production';
  const endpoint = process.env.MOMO_ENDPOINT || (isProd
    ? 'https://payment.momo.vn/v2/gateway/api/create'
    : 'https://test-payment.momo.vn/v2/gateway/api/create');

  const requestId = orderId;
  const requestType = "captureWallet";
  const extraData = "";

  // Set expireTime (thời gian sống của QR: 15 phút)
  // MoMo yêu cầu định dạng Unix timestamp theo millisecond? (Tùy phiên bản, nhưng thông thường MoMo k mặc định hỗ trợ expireTime qua API create trừ khi cung cấp). Nhưng theo tài liệu MoMo v2, không có field expireTime trực tiếp trong signature basic, nhưng nếu có thì thêm vào. Tạm bỏ qua vì MoMo có cấu hình timeout ở Dashboard.

  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
  
  const signature = crypto.createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');

  const requestBody = {
    partnerCode,
    partnerName: "Dating App",
    storeId: "DatingStore",
    requestId,
    amount,
    orderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
    lang: "vi",
    requestType,
    autoCapture: true,
    extraData,
    signature
  };

  const response = await axios.post(endpoint, requestBody, {
    headers: { 'Content-Type': 'application/json' }
  });

  return response.data;
};

export const verifyMoMoSignature = (data: any) => {
  const {
    partnerCode,
    orderId,
    requestId,
    amount,
    orderInfo,
    orderType,
    transId,
    resultCode,
    message,
    payType,
    responseTime,
    extraData,
    signature
  } = data;

  const accessKey = process.env.MOMO_ACCESS_KEY || '';
  const secretKey = process.env.MOMO_SECRET_KEY || '';

  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;
  
  const expectedSignature = crypto.createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');

  return signature === expectedSignature;
};
