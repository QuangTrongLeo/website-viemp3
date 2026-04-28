import apiBaseURL from '~/utils/httpBaseURL';

const BASE = apiBaseURL.defaults.baseURL;
const ARITST = `${BASE}/artists`;

const apiArtistUrls = {
  apiArtistUrl: ARITST,
};
export default apiArtistUrls;
