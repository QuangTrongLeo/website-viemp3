import apiVoucherUrl from '~/api/urls/apiVouchers';
import axios from 'axios';

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
