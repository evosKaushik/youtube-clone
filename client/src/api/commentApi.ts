import axiosInstance from "./axiosInstance";

const addCommentApi = async (payload: {
  targetId: string;
  targetType: "Video" | "User";
  body: string;
}) => {
  try {
    const { data } = await axiosInstance.post(
      "/comments",
      payload
    );

    return data;

  } catch (error) {
    console.log(error)
  }
};

const getCommentsApi = async (targetId: string, targetType: "Video" | "User") => {
  try {
    const { data } = await axiosInstance.get(
      `/comments/${targetId}`,
      {
        params: {
          targetType,
        },
      }
    );

    return data;

  } catch (error) {
    console.log(error)
  }
};

const likeCommentApi = async (commentId: string) => {
  try {
    const { data } = await axiosInstance.post(`/comments/like/${commentId}`);
    return data;
  } catch (error) {
    console.log(error)
  }
}
const dislikeCommentApi = async (commentId: string) => {
  try {
    const { data } = await axiosInstance.post(`/comments/dislike/${commentId}`);
    return data;
  } catch (error) {
    console.log(error)
  }
}

export {
  addCommentApi,
  getCommentsApi,
  likeCommentApi,
  dislikeCommentApi
};