"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoMoGateway = void 0;
const crypto_1 = __importDefault(require("crypto"));
const axios_1 = __importDefault(require("axios"));
class MoMoGateway {
    async createPaymentUrl(orderId, amount, description) {
        const accessKey = process.env.MOMO_ACCESS_KEY || '';
        const secretKey = process.env.MOMO_SECRET_KEY || '';
        const partnerCode = process.env.MOMO_PARTNER_CODE || '';
        const redirectUrl = process.env.MOMO_REDIRECT_URL || 'http://localhost:5173/payment/result';
        const ipnUrl = process.env.MOMO_IPN_URL || 'https://YOUR_NGROK_URL/api/payments/momo/ipn';
        const isProd = process.env.PAYMENT_MODE === 'production';
        const endpoint = process.env.MOMO_ENDPOINT || (isProd ? 'https://payment.momo.vn/v2/gateway/api/create' : 'https://test-payment.momo.vn/v2/gateway/api/create');
        const requestType = "captureWallet";
        const extraData = "";
        const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${description}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${orderId}&requestType=${requestType}`;
        const signature = crypto_1.default.createHmac('sha256', secretKey).update(rawSignature).digest('hex');
        const requestBody = {
            partnerCode, partnerName: "Dating App", storeId: "DatingStore",
            requestId: orderId, amount, orderId, orderInfo: description,
            redirectUrl, ipnUrl, lang: "vi", requestType, autoCapture: true,
            extraData, signature
        };
        const response = await axios_1.default.post(endpoint, requestBody, { headers: { 'Content-Type': 'application/json' } });
        return response.data.payUrl;
    }
    verifyCallback(data) {
        const { partnerCode, orderId, requestId, amount, orderInfo, orderType, transId, resultCode, message, payType, responseTime, extraData, signature } = data;
        const accessKey = process.env.MOMO_ACCESS_KEY || '';
        const secretKey = process.env.MOMO_SECRET_KEY || '';
        const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;
        const expectedSignature = crypto_1.default.createHmac('sha256', secretKey).update(rawSignature).digest('hex');
        return signature === expectedSignature;
    }
    getOrderId(data) { return data.orderId; }
    getResponseStatus(data) { return data.resultCode === 0 ? 'SUCCESS' : 'FAILED'; }
    getAmount(data) { return data.amount; }
}
exports.MoMoGateway = MoMoGateway;
