import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    profilePicture: { type: String, default: null },
    channelName: { type: String, default: null, unique: true },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;