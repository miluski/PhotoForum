import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://78.88.231.247:4443/api/v1",
  withCredentials: true,
});
