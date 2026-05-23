import express from "express";
import User from "../model/user.model.js";

const userLogin = async (req: express.Request, res: express.Response) => {
    const { name, email, profilePicture } = req.body;
    try {
        if (!name || !email) {
            return res.status(400).json({ success: false, error: "Name and email are required" });
        }


        const existingUser = await User.findOne({ email });

        if (existingUser) {

            return res.json({ success: false, error: "User already exists", user: existingUser });
        }


        const newUser = new User({
            name,
            email,
            profilePicture,
        });

        await newUser.save();

        res.status(201).json({ success: true, user: newUser });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error", success: false, });
    }
};

export { userLogin };