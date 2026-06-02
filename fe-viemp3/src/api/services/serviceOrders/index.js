import apiOrderUrl from '~/api/urls/apiOrders';
import axios from 'axios';

// ===== CREATE ORDER =====
export async function apiCreateOrder(payload) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(apiOrderUrl, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message);
  }
}
