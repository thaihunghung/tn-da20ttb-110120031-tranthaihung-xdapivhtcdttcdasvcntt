import { message } from "antd";
import axios from "axios";

const axiosAdmin = axios.create({
  withCredentials: true,
  baseURL: process.env.REACT_APP_API_DOMAIN_ADMIN
});

axiosAdmin.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized error
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Call the /refresh-token endpoint to get a new token
        const response = await axios.post(`${process.env.REACT_APP_API_DOMAIN_CLIENT}/refresh-token`, {}, {
          withCredentials: true
        });

        if (response.status === 200) {
          // Get new token from the response
          const newAccessToken = response.data.accessToken;

          // Update the Authorization header for the original request and retry the request
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosAdmin(originalRequest);
        }
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    // Handle 403 Forbidden error
    if (error.response && error.response.status === 403) {
      message.error("You do not have permission to access this resource."); // Show notification
      // useHistory().push('/admin'); // Redirect to '/admin' page
    }

    return Promise.reject(error);
  }
);

export { axiosAdmin };
