import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.route.js";
import videoRoutes from "./routes/video.route.js";
import commentRoutes from "./routes/comment.route.js";
import playlistRoutes from "./routes/playlist.route.js";
import translateRoute from "./routes/translate.route.js";
import paymentRoute from "./routes/payment.route.js";
import { errorHandler } from "./middleware/errorHandler.js";
import http from "http";
import { Server } from "socket.io";
dotenv.config();
import cors from "cors";
const PORT = process.env.PORT || 4000;
const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(cors({
    origin: ["https://sasta-youtube-clone.vercel.app", "http://localhost:3000"],
    credentials: true,
}));
const io = new Server(server, {
    cors: {
        origin: "*",
        credentials: true,
    },
});
app.use("/api/users", userRoutes);
app.use("/api/video", videoRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/playlist", playlistRoutes);
app.use("/api/translate", translateRoute);
app.use("/api/payments", paymentRoute);
app.get("/api/hello", (req, res) => {
    res.json({
        message: "Hello"
    });
});
app.use(errorHandler);
// Socket.IO connection handling
io.on("connection", (socket) => {
    console.log("Connected:", socket.id);
    socket.on("join-room", ({ roomId }) => {
        socket.join(roomId);
        console.log(`${socket.id} joined ${roomId}`);
        socket.to(roomId).emit("user-joined", {
            socketId: socket.id,
        });
    });
    socket.on("offer", ({ roomId, offer }) => {
        socket.to(roomId).emit("offer", offer);
    });
    socket.on("answer", ({ roomId, answer }) => {
        socket.to(roomId).emit("answer", answer);
    });
    socket.on("ice-candidate", ({ roomId, candidate }) => {
        socket.to(roomId).emit("ice-candidate", candidate);
    });
    socket.on("disconnect", () => {
        console.log("Disconnected:", socket.id);
    });
});
server.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await connectDB();
});
