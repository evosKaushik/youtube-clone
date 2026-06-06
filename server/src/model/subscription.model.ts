import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    plan: {
      type: String,
      default: "Free",
    },
    watchTimeInMinutes: {
      type: Number,
      default: 0
    },
    noOfDownloads: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
  },
);

const Subscription = mongoose.model(
  "Subscription",
  subscriptionSchema,
);

export default Subscription;