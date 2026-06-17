import apiGenreUrl from '~/api/urls/apiGenres';
import axios from 'axios';

// ===== GET ALL GENRE =====
export async function apiGetGenres() {
  try {
    const response = await axios.get(`${apiGenreUrl}/all`);
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || error.response?.data || error.message;
    throw new Error(message);
  }
}

// ===== GET GENRE BY ID =====
export async function apiGetGenre(genreId) {
  try {
    const response = await axios.get(`${apiGenreUrl}/${genreId}`);
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || error.response?.data || error.message;
    throw new Error(message);
  }
}

// ===== CREATE GENRE =====
export async function apiCreateGenre(data) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(apiGenreUrl, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || error.response?.data || error.message;
    throw new Error(message);
  }
}

// ===== UPDATE GENRE =====
export async function apiUpdateGenre(id, data) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${apiGenreUrl}/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || error.response?.data || error.message;
    throw new Error(message);
  }
}

// ===== DELETE GENRE =====
export async function apiDeleteGenre(genreId) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${apiGenreUrl}/${genreId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.success;
  } catch (error) {
    const message = error.response?.data?.message || error.response?.data || error.message;
    throw new Error(message);
  }
}
