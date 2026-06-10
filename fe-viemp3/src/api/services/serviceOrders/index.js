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

// ===== GET MY ORDERS =====
export async function apiGetMyOrders() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${apiOrderUrl}/me`, {
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

// ===== GET ORDER BY ID =====
export async function apiGetOrderById(orderId) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${apiOrderUrl}/${orderId}`, {
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

// ===== GET ALL ORDER =====
export async function apiGetOrders() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${apiOrderUrl}/all`, {
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
