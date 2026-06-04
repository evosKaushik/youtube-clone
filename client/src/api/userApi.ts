import axios from "axios";
import axiosInstance from "./axiosInstance";

export const createChannelApi = async (payload: {
  channelName: string;
  channelUsername: string;
  channelDescription: string;
}) => {
  try {
    const { data } = await axiosInstance.post(
      "/users/create-channel",
      payload,
    );

    return data;
  } catch (error) {
    console.error(error);

    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as { error?: string })?.error ||
        "Failed to create channel";

      return { success: false, error: message };
    }

    return { success: false, error: "Failed to create channel" };
  }
};
