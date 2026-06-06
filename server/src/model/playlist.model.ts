import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    type: {
      type: String,
      enum: ["watchLater", "like"],
      required: true,
    },
    watchTime: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  },
);
const Playlist = mongoose.model(
  "Playlist",
  playlistSchema,
);

export default Playlist;