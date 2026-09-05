import crypto from 'crypto';
import qs from 'qs';
import { getCreateDateVNPay, getExpireDateVNPay } from '../utils/helpers';

export const createVNPayUrl = (
  orderId: string, 
  amount: number, 
  orderInfo: string, 
  ipAddr: string
) => {
  const tmnCode = process.env.VNPAY_TMN_CODE || '';
  const secretKey = process.env.VNPAY_HASH_SECRET || '';
  
  // Tự động chuyển đổi URL dựa trên biến PAYMENT_MODE
  const isProd = process.env.PAYMENT_MODE === 'production';
  let vnpUrl = process.env.VNPAY_URL || (isProd 
    ? 'https://pay.vnpay.vn/vpcpay.html' 
    : 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html');
    
  const returnUrl = process.env.VNPAY_RETURN_URL || 'http://localhost:5173/payment/result';

  const createDate = getCreateDateVNPay();
  const expireDate = getExpireDateVNPay(15); // Hết hạn sau 15 phút

  let vnp_Params: any = {};
  vnp_Params['vnp_Version'] = '2.1.0';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = tmnCode;
  vnp_Params['vnp_Locale'] = 'vn';
  vnp_Params['vnp_CurrCode'] = 'VND';
  vnp_Params['vnp_TxnRef'] = orderId;
  vnp_Params['vnp_OrderInfo'] = orderInfo;
  vnp_Params['vnp_OrderType'] = 'other';
  vnp_Params['vnp_Amount'] = amount * 100; // VNPay yêu cầu nhân 100
  vnp_Params['vnp_ReturnUrl'] = returnUrl;
  vnp_Params['vnp_IpAddr'] = ipAddr;
  vnp_Params['vnp_CreateDate'] = createDate;
  vnp_Params['vnp_ExpireDate'] = expireDate;

  // Sắp xếp các khóa theo alphabet
  vnp_Params = sortObject(vnp_Params);

  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  
  vnp_Params['vnp_SecureHash'] = signed;
  vnpUrl += '?' + qs.stringify(vnp_Params, { encode: false });

  return vnpUrl;
};

export const verifyVNPayReturn = (vnp_Params: any) => {
  const secureHash = vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  vnp_Params = sortObject(vnp_Params);
  
  const secretKey = process.env.VNPAY_HASH_SECRET || '';
  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  return secureHash === signed;
};

function sortObject(obj: any) {
  let sorted: any = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
}
