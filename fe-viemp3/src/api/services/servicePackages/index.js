import apiPackageUrl from '~/api/urls/apiPackages';
import axios from 'axios';

// ===== CREATE PACKAGE (POST) =====
export async function apiCreatePackage(payload) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(apiPackageUrl, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Lỗi khi tạo gói cước');
  }
}

// ===== UPDATE PACKAGE (PUT) =====
export async function apiUpdatePackage(id, payload) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${apiPackageUrl}/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Lỗi khi cập nhật gói cước');
  }
}

// ===== DELETE PACKAGE (DELETE) =====
export async function apiDeletePackage(id) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${apiPackageUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Lỗi khi xóa gói cước');
  }
}

// ===== GET ALL PACKAGES (GET) =====
export async function apiGetPackages() {
  try {
    const response = await axios.get(`${apiPackageUrl}/all`);
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách gói cước:', error);
    throw error;
  }
}

// ===== GET PACKAGE BY ID (GET) =====
export async function apiGetPackageById(id) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${apiPackageUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin gói cước:', error);
    throw error;
  }
}

// ===== GET PACKAGE TYPES (GET) =====
export async function apiGetPackageTypes() {
  try {
    const response = await axios.get(`${apiPackageUrl}/types`);
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách loại gói:', error);
    throw error;
  }
}

// ===== GET DURATION TYPES (GET) =====
export async function apiGetDurationTypes() {
  try {
    const response = await axios.get(`${apiPackageUrl}/durations`);
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách thời hạn gói:', error);
    throw error;
  }
}
