import axios from 'axios';

const apiPath = process.env.REACT_APP_API_PATH || '/vie-mp3/api';

const getBaseURL = () => {
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return `http://localhost:8080${apiPath}`;
  }
  return apiPath;
};

const apiBaseURL = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
});

export const googleAuthURL =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? `http://localhost:8080/oauth2/authorization/google`
    : `https://quangtrongleo.id.vn:8080/oauth2/authorization/google`;

export default apiBaseURL;
