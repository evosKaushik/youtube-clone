import { loginOrCreateUser, createChannelForUser, registerUser, verifyOTP, loginWithPassword, } from "../services/user.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const userLogin = async (req, res, next) => {
    try {
        const user = await loginOrCreateUser(req.body);
        return res.status(user.createdAt === user.updatedAt ? 201 : 200).json(new ApiResponse(user.createdAt === user.updatedAt ? 201 : 200, { user }, "Login successful"));
    }
    catch (error) {
        next(error);
    }
};
const createChannel = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const user = await createChannelForUser(userId, req.body);
        return res.status(201).json(new ApiResponse(201, { user }, "Channel created successfully"));
    }
    catch (error) {
        next(error);
    }
};
const registerController = async (req, res, next) => {
    try {
        const newUser = await registerUser(req.body);
        return res.status(201).json(new ApiResponse(201, { userId: newUser._id }, "OTP sent successfully"));
    }
    catch (error) {
        next(error);
    }
};
const verifyOTPController = async (req, res, next) => {
    try {
        const user = await verifyOTP(req.body);
        return res.status(200).json(new ApiResponse(200, { user }, "OTP verified successfully"));
    }
    catch (error) {
        next(error);
    }
};
const loginController = async (req, res, next) => {
    try {
        const user = await loginWithPassword(req.body);
        return res.status(200).json(new ApiResponse(200, { user }, "Login successful"));
    }
    catch (error) {
        next(error);
    }
};
export { userLogin, createChannel, registerController, loginController, verifyOTPController };
