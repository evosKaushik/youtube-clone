import axiosInstance from "./axiosInstance";

const addPlaylistApi = async (payload: {
  vid: string;
  type: "watchLater" | "like";
}) => {
  try {
    const { data } = await axiosInstance.post(`/playlist/`, payload);
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getPlaylistApi = async (type: "watchLater" | "like") => {
  try {
    const { data } = await axiosInstance.get(`/playlist?type=${type}`);
    return data ?? { videos: [] };
  } catch (error) {
    console.error(error);
    return { videos: [] };
  }
};

export { addPlaylistApi, getPlaylistApi };
