import apiBaseURL from '~/utils/httpBaseURL';

const BASE = apiBaseURL.defaults.baseURL;
const ARITST = `${BASE}/artists`;
const FAVORITE = `${BASE}/favorite-artists`;

const apiArtistUrls = {
  apiArtistUrl: ARITST,
  apiFavoriteArtistUrl: FAVORITE,
};
export default apiArtistUrls;
