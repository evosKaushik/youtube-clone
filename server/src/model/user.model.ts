import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    profilePicture: {
      type: String,
      default:
        "https://github.com/shadcn.png",
    },

    channelName: {
      type: String,
      default: null
    },
    channelUsername: {
      type: String,
      unique: true,
      sparse: true,
      default: null,
    },
    channelDescription: {
      type: String,
      default: null
    },
    subscription: {
      plan: {// free | premium
        type: String,
        enum: ["free", "premium"],
        default: "free"
      },
      status: {
        type: String,
        enum: ["active", "inActive"],
        default: "active"
      },
      expiresAt: Date
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model(
  "User",
  userSchema,
);

export default User;