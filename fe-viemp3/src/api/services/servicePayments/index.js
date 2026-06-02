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

export async function apiGetPaymentCallback(queryParams) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${apiPaymentUrl}/payment-callback`, {
      params: queryParams,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Lỗi xác thực thanh toán');
  }
}
