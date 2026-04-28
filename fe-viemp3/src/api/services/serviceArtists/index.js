import apiArtistUrls from '~/api/urls/apiArtists';
import axios from 'axios';

// ===== GET ARTIST =====
export async function apiGetArtists() {
  try {
    const response = await axios.get(`${apiArtistUrls.apiArtistUrl}/all`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
}
