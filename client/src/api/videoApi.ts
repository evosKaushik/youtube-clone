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
        return null
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

export { fetchAllVideos, fetchVideoByIdApi, updateLikesApi, getVideosBySearchApi, downloadVideoById }