import axiosInstance from "./axiosInstance"

const translateApi = async (text: string) => {
    try {
        const {data} = await axiosInstance.post("/translate", { text })
        return data
    } catch (error) {
        console.log(error)
    }
}

export { translateApi }