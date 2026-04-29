import apiBaseURL from '~/utils/httpBaseURL';

const BASE = apiBaseURL.defaults.baseURL;
const SONG = `${BASE}/songs`;

const apiSongUrls = {
  apiSongUrl: SONG,
};
export default apiSongUrls;
