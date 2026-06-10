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

// ===== GET RECOMMEND SONGS =====
export async function apiGetRecommendSongs() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${apiSongUrls.apiSongUrl}/recommend`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
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

// ===== GET SONGS BY PLAYLIST =====
export async function apiGetSongsByPlaylist(playlistId) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${apiSongUrls.apiSongUrl}/playlist/${playlistId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Lỗi khi lấy bài hát theo playlist';
    throw new Error(message);
  }
}

// ===== CREATE SONG =====
export async function apiCreateSong(title, description, artistId, genreId, cover, audio) {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('artistId', artistId);
    formData.append('genreId', genreId);
    formData.append('cover', cover);
    formData.append('audio', audio);
    const response = await axios.post(apiSongUrls.apiSongUrl, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  } catch (error) {
    console.log(error.response);
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
}

// ===== UPDATE SONG =====
export async function apiUpdateSong(id, title, description, genreId, albumId, cover, audio) {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    if (title) formData.append('title', title.trim());
    if (description) formData.append('description', description);
    if (genreId) formData.append('genreId', genreId);
    if (albumId) formData.append('albumId', albumId);
    if (cover) {
      formData.append('cover', cover);
    }
    if (audio) {
      formData.append('audio', audio);
    }

    const response = await axios.put(`${apiSongUrls.apiSongUrl}/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
}

// ===== DELETE SONG =====
export async function apiDeleteSong(songId) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(apiSongUrls.apiSongUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        songId: songId,
      },
    });
    return response.data.success;
  } catch (error) {
    const message = error.response?.data?.message || error.response?.data || error.message;
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

export async function apiAddSongToFavorite(songId) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${apiSongUrls.apiFavoriteSongUrl}/${songId}`,
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

export async function apiRemoveSongFromFavorite(songId) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${apiSongUrls.apiFavoriteSongUrl}/${songId}`, {
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
