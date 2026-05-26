import axios from "axios";

let userId = "";

if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");

    if (user) {
        userId = JSON.parse(user)._id;
    }
}

const axiosInstance = axios.create({
    baseURL:
        process.env.NEXT_PUBLIC_BACKEND_URL,

    withCredentials: true,

    headers: {
        "Content-Type": "application/json",
        userId,
    },
});

export default axiosInstance;