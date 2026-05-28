import axiosInstance from "./axiosInstance";


const addPlaylistApi = async (payload: {
    vid: string;
    type: "watchLater" | "like";
}) => {
    const {data} = await axiosInstance.post(`/playlist/`, payload);
    return data;
};

const getPlaylistApi = async ( type: "watchLater" | "like") => {
  const {data} = await axiosInstance.get(`/playlist?type=${type}`);
  return data;
};
export { addPlaylistApi, getPlaylistApi }