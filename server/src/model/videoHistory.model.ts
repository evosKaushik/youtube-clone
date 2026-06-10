import mongoose from "mongoose";

const videoHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
      index: true,
    },

    totalWatchedSeconds: {
      type: Number,
      default: 0,
    },

    
    lastHeartbeatAt: {
      type: Date,
      default: Date.now,
    },

   
    sessionEndedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);


videoHistorySchema.index({ userId: 1, videoId: 1 }, { unique: true });

const VideoHistory = mongoose.model("VideoHistory", videoHistorySchema);

export default VideoHistory;