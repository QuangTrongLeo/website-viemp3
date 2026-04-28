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
