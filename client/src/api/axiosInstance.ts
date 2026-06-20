import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const user = localStorage.getItem("user");

        if (user) {
            config.headers["userId"] = JSON.parse(user)._id;
        } else {
            delete config.headers["userId"];
        }
    }

    return config;
});

axiosInstance.interceptors.response.use(
    (response) => {
        // Unwrap ApiResponse if structure matches { success, data, message }
        if (response.data && response.data.success !== undefined && response.data.data !== undefined) {
            response.data = response.data.data;
        }
        return response;
    },
    (error) => {
        // Map backend error message to error.response.data.error for frontend compatibility
        if (error.response && error.response.data && error.response.data.message) {
            error.response.data.error = error.response.data.message;
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;