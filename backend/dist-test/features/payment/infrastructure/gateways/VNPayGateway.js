"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VNPayGateway = void 0;
const helpers_1 = require("../../../../utils/helpers");
const crypto_1 = __importDefault(require("crypto"));
const qs_1 = __importDefault(require("qs"));
class VNPayGateway {
    async createPaymentUrl(orderId, amount, description, ipAddr) {
        const tmnCode = process.env.VNPAY_TMN_CODE || '';
        const secretKey = process.env.VNPAY_HASH_SECRET || '';
        const isProd = process.env.PAYMENT_MODE === 'production';
        let vnpUrl = process.env.VNPAY_URL || (isProd ? 'https://pay.vnpay.vn/vpcpay.html' : 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html');
        const returnUrl = process.env.VNPAY_RETURN_URL || 'http://localhost:5173/payment/result';
        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = 'vn';
        vnp_Params['vnp_CurrCode'] = 'VND';
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = description;
        vnp_Params['vnp_OrderType'] = 'other';
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = (0, helpers_1.getCreateDateVNPay)();
        vnp_Params['vnp_ExpireDate'] = (0, helpers_1.getExpireDateVNPay)(15);
        vnp_Params = this.sortObject(vnp_Params);
        const signData = qs_1.default.stringify(vnp_Params, { encode: false });
        const hmac = crypto_1.default.createHmac('sha512', secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
        vnp_Params['vnp_SecureHash'] = signed;
        return vnpUrl + '?' + qs_1.default.stringify(vnp_Params, { encode: false });
    }
    verifyCallback(vnp_Params) {
        let params = { ...vnp_Params };
        const secureHash = params['vnp_SecureHash'];
        delete params['vnp_SecureHash'];
        delete params['vnp_SecureHashType'];
        params = this.sortObject(params);
        const secretKey = process.env.VNPAY_HASH_SECRET || '';
        const signData = qs_1.default.stringify(params, { encode: false });
        const hmac = crypto_1.default.createHmac('sha512', secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
        return secureHash === signed;
    }
    getOrderId(data) { return data['vnp_TxnRef']; }
    getResponseStatus(data) { return data['vnp_ResponseCode'] === '00' ? 'SUCCESS' : 'FAILED'; }
    getAmount(data) { return parseInt(data['vnp_Amount']) / 100; }
    sortObject(obj) {
        let sorted = {};
        let str = [];
        for (let key in obj) {
            if (obj.hasOwnProperty(key))
                str.push(encodeURIComponent(key));
        }
        str.sort();
        for (let key = 0; key < str.length; key++) {
            sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
        }
        return sorted;
    }
}
exports.VNPayGateway = VNPayGateway;
