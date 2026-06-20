import axios from "axios";
import axiosInstance from "./axiosInstance";

export const createChannelApi = async (payload: {
  channelName: string;
  channelUsername: string;
  channelDescription: string;
}) => {
  try {
    const { data } = await axiosInstance.post("/users/create-channel", payload);

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

export const registerApi = async (payload: {
  name: string;
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  userState: string;
}) => {
  try {
    const { data } = await axiosInstance.post("/users/register", payload);

    return data;
  } catch (error) {
    console.error(error);

    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as { error?: string })?.error ||
        "Failed to signup user";

      return { success: false, error: message };
    }

    return { success: false, error: "Failed to signup user" };
  }
};


export const verifyOtpApi = async (payload: { email: string; otp: string }) => {
  try {
    const { data } = await axiosInstance.post("/users/verify-otp", payload);

    return data;
  } catch (error) {
    console.error(error);

    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as { error?: string })?.error ||
        "Failed to verify OTP";

      return { success: false, error: message };
    }

    return { success: false, error: "Failed to verify OTP" };
  }
};


export const loginApi = async (payload: {
  email: string;
  password: string;
}) => {
  try {
    const { data } = await axiosInstance.post("/users/login", payload);

    return data;
  } catch (error) {
    console.error(error);

    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as { error?: string })?.error ||
        "Failed to login user";

      return { success: false, error: message };
    }

    return { success: false, error: "Failed to login user" };
  }
}