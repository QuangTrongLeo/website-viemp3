import axios from 'axios';

// lấy biến môi trường
const httpBaseURL = process.env.REACT_APP_API_BASE_URL;

const apiBaseURL = axios.create({
  baseURL: httpBaseURL,
});

export default apiBaseURL;
