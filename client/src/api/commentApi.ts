import axiosInstance from "./axiosInstance";


const addCommentApi = async (data: {
    videoId: string;
    body: string;
}) => {
    const response = await axiosInstance.post(
        "/comments",
        data
    );

    return response.data;
};

const getCommentsApi = async (
  videoId: string
) => {
  const response = await axiosInstance.get(
    `/comments/${videoId}`
  );

  return response.data;
};
export { addCommentApi, getCommentsApi }