import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.route.js";

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

app.get("/api/hello", (req: express.Request, res: express.Response) => {
  res.json({
    message: "Hello"
  })
})

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await connectDB();
});
