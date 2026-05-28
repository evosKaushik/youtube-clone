import axiosInstance from "./axiosInstance"

const fetchAllVideos = async () => {
    try {
        const { data } = await axiosInstance.get("/video/")
        return data
    } catch (error) {
        console.error(error)
    }
}
const fetchVideoByIdApi = async (payload: string) => {
    try {
        const { data } = await axiosInstance.get(`/video/${payload}`)
        return data
    } catch (error) {
        console.error(error)
    }
}
const updateLikesApi = async (payload: string) => {

    try {
        const { data } = await axiosInstance.put(`/video/like/${payload}`)
        return data
    } catch (error) {
        console.error(error)
    }
}
const getVideosBySearchApi = async (payload: string) => {
    try {
        const { data } = await axiosInstance.get(`/video/search?q=${payload}`)
        return data
    } catch (error) {
        console.error(error)
    }
}
export { fetchAllVideos, fetchVideoByIdApi, updateLikesApi, getVideosBySearchApi }