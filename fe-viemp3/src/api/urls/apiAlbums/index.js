import apiBaseURL from '~/utils/httpBaseURL';

const BASE = apiBaseURL.defaults.baseURL;
const ALBUM = `${BASE}/albums`;
const FAVORITE = `${BASE}/favorite-albums`;

const apiAlbumUrls = {
  apiAlbumUrl: ALBUM,
  apiFavoriteAlbumUrl: FAVORITE,
};
export default apiAlbumUrls;