import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://78.88.231.247:4443/api/v1",
  withCredentials: true,
  timeout: 10000,
});

// prevent multiple refresh requests
let isRefreshing = false;
let refreshSubscribers: Array<(token?: string) => void> = [];

const onRefreshed = () => {
  refreshSubscribers.forEach((callback) => callback());
  refreshSubscribers = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (
        originalRequest.url === "/auth/refresh-tokens" ||
        originalRequest.url === "/login"
      ) {
        console.log(
          `401 from ${originalRequest.url}, rejecting without refresh`
        );
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push(() => {
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshResponse = await axiosInstance.post(
          "/auth/refresh-tokens"
        );

        isRefreshing = false;
        onRefreshed();
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;

        return Promise.reject(refreshError);
      }
    }

    console.log("Rejecting non-401 error:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
