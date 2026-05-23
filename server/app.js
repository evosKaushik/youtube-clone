import express from "express";
import "dotenv/config";
import cors from "cors";
import "./config/db.js";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors({
    origin: ["https://sasta-youtube-clone.vercel.app", "http://localhost:3000"],
}));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
 