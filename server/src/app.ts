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

dotenv.config();
import cors from "cors";

 
const PORT = process.env.PORT || 4000; 
const app = express();

app.use(express.json());
app.use(cors({
  origin: ["https://sasta-youtube-clone.vercel.app", "http://localhost:3000"],
  credentials: true,
}));

app.use("/api/users", userRoutes);
app.use("/api/video", videoRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/playlist", playlistRoutes);
app.use("/api/translate", translateRoute);
app.use("/api/payments", paymentRoute);

app.get("/api/hello", (req: express.Request, res: express.Response) => {
  res.json({
    message: "Hello"
  })
})

app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await connectDB();
});



