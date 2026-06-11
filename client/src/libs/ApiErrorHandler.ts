import axios from "axios";
import toast from "react-hot-toast";

export const handleApiError = (  error: unknown,  fallback = "Something went wrong") => {
  console.error("API ERROR ➜", error);

  if (axios.isAxiosError(error)) {
    const message =
      (error.response?.data as any)?.error ||
      (error.response?.data as any)?.message ||
      fallback;

    toast.error(message);
    return message;
  }

  toast.error(fallback);
  return fallback;
};