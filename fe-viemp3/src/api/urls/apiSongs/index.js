import apiBaseURL from '~/utils/httpBaseURL';

const BASE = apiBaseURL.defaults.baseURL;
const SONG = `${BASE}/songs`;
const FAVORITE = `${BASE}/favorite-songs`;

const apiSongUrls = {
  apiSongUrl: SONG,
  apiFavoriteSongUrl: FAVORITE,
};
export default apiSongUrls;
