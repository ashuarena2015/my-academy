import axios from "axios";

axios.defaults.withCredentials = true;

export const config = {
  baseURL: "http://localhost:3001/api"
};
const axiosInstance = axios.create(config);

export default axiosInstance;
