import axiosInstance from "./axiosInstance";

export const createChannelApi = async (payload: { channelName: string, channelUsername: string, channelDescription: string }) => {
    const { data } = await axiosInstance.post(
        "/users/create-channel",
        payload,
    );

    return data
}