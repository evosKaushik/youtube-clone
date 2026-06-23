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
      lowercase: true,
      trim: true,
      default: function () {
        return this.email?.split("@")[0] ?? null;
      },
    },
    channelDescription: {
      type: String,
      default: null
    },
    subscription: {
      plan: {
        type: String,
        enum: ["Free", "Bronze", "Silver", "Gold"],
        default: "Free"
      },
      status: {
        type: String,
        enum: ["active", "inActive", "expired"],
        default: "active"
      },
      watchTimeInMinutes: {
        type: Number,
        default: 5
      },
      noOfDownloads: {
        type: Number,
        default: 0
      },
      expiresAt: {
        type: Date,
        default: null
      }
    },
    subscriberCount: {
      type: Number,
      default: 0,
    },
    isCurrentWatchTimeExcised: {
      type: Boolean,
      default: false,
    },
    userState: {
      type: String,
      default: null
    },
    password: {
      type: String,
      default: null
    },
    verified: {
      type: Boolean,
      default: false
    }
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