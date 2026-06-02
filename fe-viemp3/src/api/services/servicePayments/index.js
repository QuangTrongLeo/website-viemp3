import apiPaymentUrl from '~/api/urls/apiPayments';
import axios from 'axios';

export async function apiCreatePaymentUrl(orderId) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${apiPaymentUrl}/payment-url/${orderId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message);
  }
}
