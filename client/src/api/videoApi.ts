import axiosInstance from "./axiosInstance"

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
export { fetchAllVideos, fetchVideoByIdApi, updateLikesApi, getVideosBySearchApi }