import axios from "axios"
import axiosInstance from "./axiosInstance"
import toast from "react-hot-toast"

const fetchAllVideos = async () => {
    try {
        const { data } = await axiosInstance.get("/video/")
        return data || []
    } catch (error) {
        console.error(error)
        return []
    }
}
const fetchVideoByIdApi = async (payload: string) => {
    try {
        const { data } = await axiosInstance.get(`/video/${payload}`)
        return data
    } catch (error) {
        console.error(error)
        throw error
    }
}
const updateLikesApi = async (payload: string) => {

    try {
        const { data } = await axiosInstance.put(`/video/like/${payload}`)
        return data
    } catch (error) {
        console.error(error)
        return null
    }
}
const getVideosBySearchApi = async (payload: string) => {
    try {
        const { data } = await axiosInstance.get(`/video/search?q=${payload}`)
        return data || { data: [] }
    } catch (error) {
        console.error(error)
        return { data: [] }
    }
}
const downloadVideoById = async (videoId: string) => {
    try {
        const { data } = await axiosInstance.get(`/video/download/${videoId}`)
        const downloadUrl: string = data.downloadUrl
        if (downloadUrl) {
            window.location.href = downloadUrl
        }
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            toast.error(error.response?.data?.error || "Something went wrong")
        }
    }
}
const sendWatchHeartbeatApi = async (videoId: string) => {
    try {
        const { data } = await axiosInstance.post(`/video/heartbeat`, {
            videoId,
        });

        return data;
    } catch (error) {
        // Silently fail — heartbeat is a background tracking mechanism,
        // not critical for video playback. Don't show toasts or reload.
        return null;
    }
};

const stopWatchApi = async (videoId: string) => {
    try {
        const { data } = await axiosInstance.post(`/video/stop`, {
            videoId,
        });

        return data;
    } catch (error) {
        // Silently fail — stop is a background tracking call.
        return null;
    }
};

const getHistoryVideos = async () => {
    try {
        console.log("Calling API...");
        const { data } = await axiosInstance.get("/video/history");
        console.log("Calling API DONE...");

        return data;
    } catch (error) {
        // if (axios.isAxiosError(error)) {
        //     console.error(error?.status);
        //     toast.error(error?.response?.data?.error || "Something went wrong")

        // }
        return null;
    }
}
const getDownloadedVideos = async () => {
    try {
        const { data } = await axiosInstance.get("/video/downloads");
        return data || [];
    } catch (error) {
        console.error(error);
        return [];
    }
}

const getDownloadCountApi = async () => {
    try {
        const { data } = await axiosInstance.get("/video/downloads/count");
        return data?.data?.count || 0;
    } catch (error) {
        console.error(error);
        return 0;
    }
}

const getTodayStatsApi = async () => {
    try {
        const { data } = await axiosInstance.get("/video/today-stats");
       
        return data || { todayDownloads: 0, todayWatchSeconds: 0, totalDownloads: 0, totalVideosWatched: 0, totalWatchTimeUsed: 0, watchTimeLimitMinutes: 5, downloadLimit: 0 };
    } catch (error) {
        console.error(error);
        return { todayDownloads: 0, todayWatchSeconds: 0, totalDownloads: 0, totalVideosWatched: 0, totalWatchTimeUsed: 0, watchTimeLimitMinutes: 5, downloadLimit: 0 };
    }
}

export { fetchAllVideos, fetchVideoByIdApi, updateLikesApi, getVideosBySearchApi, downloadVideoById, sendWatchHeartbeatApi, stopWatchApi, getHistoryVideos, getDownloadedVideos, getDownloadCountApi, getTodayStatsApi }