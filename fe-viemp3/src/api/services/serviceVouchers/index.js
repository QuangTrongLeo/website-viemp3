import apiVoucherUrl from '~/api/urls/apiVouchers';
import axios from 'axios';

// ===== CREATE VOUCHER =====
export async function apiCreateVoucher(payload) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(apiVoucherUrl, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Lỗi khi tạo voucher');
  }
}

// ===== UPDATE VOUCHER =====
export async function apiUpdateVoucher(id, payload) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${apiVoucherUrl}/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Lỗi khi cập nhật voucher');
  }
}

// ===== DELETE VOUCHER =====
export async function apiDeleteVoucher(id) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${apiVoucherUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Lỗi khi xóa voucher');
  }
}

// ===== GET VOUCHER BY ID =====
export async function apiGetVoucherById(id) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${apiVoucherUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin voucher:', error);
    throw error;
  }
}

// ===== GET ALL VOUCHERS =====
export async function apiGetAllVouchers() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${apiVoucherUrl}/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách toàn bộ voucher:', error);
    throw error;
  }
}

// ===== GET AVAILABLE VOUCHERS =====
export async function apiGetAvailableVouchers() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${apiVoucherUrl}/available`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách voucher khả dụng:', error);
    throw error;
  }
}
