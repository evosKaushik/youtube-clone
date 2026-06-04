import multer, { FileFilterCallback, StorageEngine } from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

const videoPath = "uploads/videos";
const thumbnailPath = "uploads/thumbnails";

if (!fs.existsSync(videoPath)) {
  fs.mkdirSync(videoPath, { recursive: true });
}

if (!fs.existsSync(thumbnailPath)) {
  fs.mkdirSync(thumbnailPath, { recursive: true });
}

const storage: StorageEngine = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    if (file.fieldname === "video") {
      cb(null, videoPath);
    } else if (file.fieldname === "thumbnail") {
      cb(null, thumbnailPath);
    } else {
      cb(new Error("Invalid field"), "");
    }
  },

  filename: (req: Request, file: Express.Multer.File, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname);
    const fileName = `${file.fieldname}-${uniqueSuffix}${extension}`;
    cb(null, fileName);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  if (file.fieldname === "video") {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only video files allowed"));
    }
  } else if (file.fieldname === "thumbnail") {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files allowed"));
    }
  } else {
    cb(new Error("Invalid field"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});

export default upload;
