import apiSongUrls from '~/api/urls/apiSongs';
import axios from 'axios';

// ===== GET ALL SONGS =====
export async function apiGetSongs() {
  try {
    const response = await axios.get(`${apiSongUrls.apiSongUrl}/all`);
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Lỗi khi lấy danh sách bài hát';
    throw new Error(message);
  }
}

// ===== GET SONGS BY GENRE =====
export async function apiGetSongsByGenre(genreId) {
  try {
    const response = await axios.get(`${apiSongUrls.apiSongUrl}/genre/${genreId}`);
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
}