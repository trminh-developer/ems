import { Router } from 'express';
import { 
  createVNPayPayment, 
  vnpayReturn, 
  createMoMoPayment, 
  momoIpn 
} from '../controllers/payment.controller';

const router = Router();

// VNPay
router.post('/vnpay/create', createVNPayPayment);
router.get('/vnpay/return', vnpayReturn); // VNPay redirect back as GET

// MoMo
router.post('/momo/create', createMoMoPayment);
router.post('/momo/ipn', momoIpn); // MoMo IPN is POST

export default router;
