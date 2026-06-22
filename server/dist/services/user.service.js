import User from "../model/user.model.js";
import crypto from "node:crypto";
import { sendOTP } from "./resend.js";
import { ApiError } from "../utils/ApiError.js";
const otpSession = new Map();
const loginOrCreateUser = async (data) => {
    const { name, email, profilePicture, userState } = data;
    if (!name || !email) {
        throw new ApiError(400, "Name and email are required");
    }
    let user = await User.findOne({ email }).lean();
    if (user) {
        return user;
    }
    const username = email.split("@")[0];
    user = await User.create({
        name,
        email,
        username,
        userState,
        profilePicture,
    });
    return user;
};
const createChannelForUser = async (userId, data) => {
    const { channelName, channelDescription, channelUsername } = data;
    if (!channelName || !channelDescription || !channelUsername) {
        throw new ApiError(400, "All fields are required");
    }
    const existingChannelName = await User.findOne({ channelUsername }).lean();
    if (existingChannelName) {
        throw new ApiError(400, "Channel name already taken");
    }
    const user = await User.findByIdAndUpdate(userId, { channelName, channelDescription, channelUsername }, { new: true }).lean();
    return user;
};
const registerUser = async (data) => {
    const { name, username, email, password, userState } = data;
    if (!name || !username || !email || !password || !userState) {
        throw new ApiError(400, "All fields are required");
    }
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
        throw new ApiError(400, "User already exists");
    }
    const generatedOTP = crypto.randomInt(0, 10000).toString().padStart(4, "0");
    const newUser = await User.create({
        name,
        username,
        email,
        password,
        userState,
        verified: false,
    });
    otpSession.set(email, generatedOTP);
    const otpResult = await sendOTP(email, generatedOTP);
    console.log(otpResult);
    if (!otpResult) {
        throw new ApiError(500, "Failed to send OTP");
    }
    console.log(`OTP send to ${email}: ${generatedOTP}`);
    console.log(otpSession.get(email));
    return newUser;
};
const verifyOTP = async (data) => {
    const { email, otp } = data;
    if (!email || !otp) {
        throw new ApiError(400, "Email and OTP are required");
    }
    const storedOTP = otpSession.get(email);
    if (!storedOTP) {
        throw new ApiError(400, "No OTP found for this email");
    }
    if (storedOTP !== otp) {
        throw new ApiError(400, "Invalid OTP");
    }
    const updatedUser = await User.findOneAndUpdate({ email }, { verified: true }, { returnDocument: 'after' }).select("-password -__v").lean();
    otpSession.delete(email);
    return updatedUser;
};
const loginWithPassword = async (data) => {
    const { email, password } = data;
    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }
    const user = await User.findOne({ email }).select("-__v").lean();
    if (!user) {
        throw new ApiError(400, "User not found");
    }
    if (user.password !== password) {
        throw new ApiError(400, "Invalid password");
    }
    if (!user.verified) {
        throw new ApiError(400, "User not verified. Please verify your account.");
    }
    return user;
};
export { loginOrCreateUser, createChannelForUser, registerUser, verifyOTP, loginWithPassword, };
