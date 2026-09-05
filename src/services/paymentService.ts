const API_URL = 'http://localhost:3000/api/payments';

export const createPayment = async (provider: 'momo' | 'vnpay', data: { orderId: string; amount: number; description?: string }) => {
  try {
    const response = await fetch(`${API_URL}/${provider}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`Error calling ${provider} API:`, error);
    throw error;
  }
};
