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

export default axiosInstance;