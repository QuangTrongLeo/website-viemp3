import apiArtistUrls from '~/api/urls/apiArtists';
import axios from 'axios';

// ===== GET ARTIST =====
export async function apiGetArtist(artistId) {
  try {
    const response = await axios.get(`${apiArtistUrls.apiArtistUrl}/${artistId}`);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// ===== GET ARTIST BY NAME =====
export async function apiGetArtistByName(name) {
  try {
    const response = await axios.get(apiArtistUrls.apiArtistUrl, {
      params: { name: name },
    });
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || error.response?.data || error.message;
    throw new Error(message);
  }
}

// ===== GET ALL ARTIST =====
export async function apiGetArtists() {
  try {
    const response = await axios.get(`${apiArtistUrls.apiArtistUrl}/all`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

// =============== FAVORITE ARTIST ===============
export async function apiGetMyFavoriteArtists() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(apiArtistUrls.apiFavoriteArtistUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách nghệ sĩ:', error);
    return [];
  }
}

export async function apiAddArtistToFavorite(artistId) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${apiArtistUrls.apiFavoriteArtistUrl}/${artistId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.success;
  } catch (error) {
    const message = error.response?.data?.message || error.response?.data || error.message;
    throw new Error(message);
  }
}

export async function apiRemoveArtistFromFavorite(artistId) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${apiArtistUrls.apiFavoriteArtistUrl}/${artistId}`, {
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
