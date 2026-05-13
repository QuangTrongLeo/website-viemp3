import apiSongUrls from '~/api/urls/apiSongs';

import axios from 'axios';

// ===== GET SONG =====
export async function apiGetSong(songId) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${apiSongUrls.apiSongUrl}/${songId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message;
    throw new Error(message);
  }
}

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

// ===== GET SONGS BY ALBUM =====
export async function apiGetSongsByAlbum(albumId) {
  try {
    const response = await axios.get(`${apiSongUrls.apiSongUrl}/album/${albumId}`);
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Lỗi khi lấy bài hát theo album';
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

// ===== GET SONGS BY ARTIST =====
export async function apiGetSongsByArtist(artistId) {
  try {
    const response = await axios.get(`${apiSongUrls.apiSongUrl}/artist/${artistId}`);
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
}

// =============== FAVORITE SONG ===============
export async function apiGetMyFavoriteSongs() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(apiSongUrls.apiFavoriteSongUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    if (error.response?.status === 403 || error.response?.status === 401) return [];
  }
}