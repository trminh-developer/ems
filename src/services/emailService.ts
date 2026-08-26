import emailjs from '@emailjs/browser';

// ĐIỀN CÁC THÔNG SỐ CỦA BẠN VÀO ĐÂY:
const SERVICE_ID = 'YOUR_SERVICE_ID'; // Thay bằng Service ID của bạn
const TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // Thay bằng Template ID của bạn
const PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Thay bằng Public Key của bạn

export const sendOTPEmail = async (toEmail: string, otpCode: string) => {
  if (SERVICE_ID === 'YOUR_SERVICE_ID') {
    console.warn('Bạn chưa cấu hình EmailJS! Đang log OTP ra console thay vì gửi email.');
    console.log(`[EmailJS MOCK] Gửi tới: ${toEmail} | OTP: ${otpCode}`);
    return true; // Giả lập thành công
  }

  try {
    const templateParams = {
      to_email: toEmail,
      otp_code: otpCode,
    };

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );

    return response.status === 200;
  } catch (error) {
    console.error('Lỗi khi gửi email:', error);
    throw new Error('Không thể gửi email OTP. Vui lòng kiểm tra cấu hình EmailJS.');
  }
};
