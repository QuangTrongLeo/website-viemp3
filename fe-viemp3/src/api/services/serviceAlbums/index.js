import apiAlbumUrls from '~/api/urls/apiAlbums';
import axios from 'axios';

// ===== GET ALBUM =====
export async function apiGetAlbum(albumId) {
  try {
    const response = await axios.get(`${apiAlbumUrls.apiAlbumUrl}/${albumId}`);
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi lấy album:', error);
    throw error;
  }
}

// ===== GET ALL ALBUMS =====
export async function apiGetAlbums() {
  try {
    const response = await axios.get(`${apiAlbumUrls.apiAlbumUrl}/all`);
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách album:', error);
    throw error;
  }
}

// ===== CREATE ALBUM =====
export async function apiCreateAlbum(formData) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(apiAlbumUrls.apiAlbumUrl, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || error.response?.data || error.message || 'Lỗi tạo album';
    throw new Error(message);
  }
}

// ===== UPDATE ALBUM =====
export async function apiUpdateAlbum(id, formData) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${apiAlbumUrls.apiAlbumUrl}/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || error.response?.data || error.message || 'Lỗi cập nhật album';
    throw new Error(message);
  }
}

// ===== DELETE ALBUM =====
export async function apiDeleteAlbum(albumId) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(apiAlbumUrls.apiAlbumUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        albumId,
      },
    });
    return response.data.success;
  } catch (error) {
    const message = error.response?.data?.message || error.response?.data || error.message || 'Lỗi xóa album';
    throw new Error(message);
  }
}
