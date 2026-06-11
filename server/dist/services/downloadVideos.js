import Video from "../model/video.model.js";
export const getDownloadUrl = async (videoId) => {
    const video = await Video.findById(videoId).lean();
    if (!video) {
        throw new Error("Video not found");
    }
    return video.videoURL.replace("/video/upload/", `/video/upload/fl_attachment:${encodeURIComponent(video.name.toLowerCase())}/`);
};
