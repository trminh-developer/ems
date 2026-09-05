import axios from 'axios';

const API_URL = 'http://localhost:3000/api/payments';

export const createPayment = async (provider: 'momo' | 'vnpay', data: { orderId: string; amount: number; description?: string }) => {
  try {
    const response = await axios.post(`${API_URL}/${provider}/create`, data);
    return response.data;
  } catch (error) {
    console.error(`Error calling ${provider} API:`, error);
    throw error;
  }
};
