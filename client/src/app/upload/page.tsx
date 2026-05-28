"use client";

import axiosInstance from "@/api/axiosInstance";

import SectionCard from "@/components/upload/SectionCard";
import AppShell from "@/layout/AppShell";
import Image from "next/image";

import { ChangeEvent, FormEvent, useRef, useState } from "react";

import { FiUpload, FiImage, FiVideo, FiX } from "react-icons/fi";

// =========================================
// TYPES
// =========================================

type FormDataType = {
  title: string;
  description: string;
  video: File | null;
  thumbnail: File | null;
};

type ErrorType = {
  video: string;
  thumbnail: string;
};

export default function UploadVideoPage() {
  const [formData, setFormData] = useState<FormDataType>({
    title: "",
    description: "",
    video: null,
    thumbnail: null,
  });

  const [errors, setErrors] = useState<ErrorType>({
    video: "",
    thumbnail: "",
  });

  const [isUploading, setIsUploading] = useState<boolean>(false);

  const videoInputRef = useRef<HTMLInputElement | null>(null);

  const thumbnailInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // CLEAR ERROR
    setErrors((prev) => ({
      ...prev,
      video: "",
    }));

    // CHECK VIDEO TYPE
    if (!file.type.startsWith("video/")) {
      setErrors((prev) => ({
        ...prev,
        video: "Only video files are allowed.",
      }));

      return;
    }

    // 100MB
    const maxSize = 1024 * 1024 * 100;

    if (file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        video: "Video size must be below 100MB.",
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      video: file,
    }));
  };

  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setErrors((prev) => ({
      ...prev,
      thumbnail: "",
    }));

    // IMAGE CHECK
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        thumbnail: "Only image files are allowed.",
      }));

      return;
    }

    // 5MB
    const maxSize = 1024 * 1024 * 5;

    if (file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        thumbnail: "Thumbnail must be below 5MB.",
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      thumbnail: file,
    }));
  };

  const removeVideo = () => {
    setFormData((prev) => ({
      ...prev,
      video: null,
    }));
  };

  const removeThumbnail = () => {
    setFormData((prev) => ({
      ...prev,
      thumbnail: null,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // VIDEO CHECK
    if (!formData.video) {
      setErrors((prev) => ({
        ...prev,
        video: "Please upload a video.",
      }));

      return;
    }

    // TITLE CHECK
    if (formData.title.trim().length < 5) {
      alert("Title must be at least 5 characters.");
      return;
    }

    // DESCRIPTION CHECK
    if (formData.description.trim().length < 10) {
      alert("Description must be at least 10 characters.");

      return;
    }

    try {
      setIsUploading(true);

      // =========================================
      // MULTIPART FORM DATA
      // =========================================

      const uploadData = new FormData();

      uploadData.append("title", formData.title);
      uploadData.append("description", formData.description);
      uploadData.append("video", formData.video);
      if (formData.thumbnail) {
        uploadData.append("thumbnail", formData.thumbnail);
      }

      console.log("UPLOAD DATA:", formData);

      // =========================================
      // TODO: IMPLEMENT API HERE
      // =========================================

      const res = await axiosInstance.post("/video/upload", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res)

      /*
    
      const response = await axios.post(
        "http://localhost:5000/api/videos/upload",
        uploadData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);

      */

      await new Promise((resolve) => setTimeout(resolve, 2000));

      alert("Video uploaded successfully.");

      // RESET FORM
      setFormData({
        title: "",
        description: "",
        video: null,
        thumbnail: null,
      });
    } catch (error) {
      console.log(error);

      alert("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AppShell>
      <section className="min-h-screen bg-background text-text px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* HEADER */}

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Upload Video</h1>

              <p className="text-secondaryText mt-1 text-sm">
                Upload your content like YouTube Studio.
              </p>
            </div>

            <button onClick={() => window.history.back()} className="icon-btn">
              <FiX />
            </button>
          </div>

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6"
          >
            {/* LEFT */}

            <div className="space-y-6">
              {/* DETAILS */}

              <SectionCard
                title="Video Details"
                description="Add title and description."
              >
                <div className="space-y-5">
                  {/* TITLE */}

                  <div>
                    <label className="text-sm text-secondaryText block mb-2">
                      Title
                    </label>

                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      maxLength={100}
                      placeholder="Add a title"
                      className="w-full bg-background border border-border rounded-2xl px-4 py-3 outline-none focus:border-zinc-500"
                    />

                    <div className="flex justify-end mt-2 text-xs text-secondaryText">
                      {formData.title.length}/100
                    </div>
                  </div>

                  {/* DESCRIPTION */}

                  <div>
                    <label className="text-sm text-secondaryText block mb-2">
                      Description
                    </label>

                    <textarea
                      rows={8}
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      maxLength={5000}
                      placeholder="Tell viewers about your video"
                      className="w-full resize-none bg-background border border-border rounded-2xl px-4 py-3 outline-none focus:border-zinc-500"
                    />

                    <div className="flex justify-end mt-2 text-xs text-secondaryText">
                      {formData.description.length}/5000
                    </div>
                  </div>
                </div>
              </SectionCard>

              {/* THUMBNAIL */}

              <SectionCard
                title="Thumbnail"
                description="Upload custom thumbnail."
              >
                {!formData.thumbnail ? (
                  <button
                    type="button"
                    onClick={() => thumbnailInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-border rounded-3xl h-64 flex flex-col items-center justify-center gap-4 hover:bg-hover transition-all"
                  >
                    <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center text-3xl">
                      <FiImage />
                    </div>

                    <div className="text-center">
                      <p className="font-medium">Upload Thumbnail</p>

                      <p className="text-sm text-secondaryText mt-1">
                        JPG, PNG, WEBP up to 5MB
                      </p>
                    </div>
                  </button>
                ) : (
                  <div className="relative rounded-3xl overflow-hidden border border-border">
                    <div className="relative w-full h-72">
                      <Image
                        src={URL.createObjectURL(formData.thumbnail)}
                        alt="thumbnail"
                        fill
                        className="object-cover"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={removeThumbnail}
                      className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/70 text-white flex items-center justify-center"
                    >
                      <FiX />
                    </button>
                  </div>
                )}

                {errors.thumbnail && (
                  <p className="text-red-500 text-sm mt-3">
                    {errors.thumbnail}
                  </p>
                )}

                <input
                  hidden
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                />
              </SectionCard>
            </div>

            {/* RIGHT */}

            <div className="space-y-6">
              {/* VIDEO */}

              <SectionCard
                title="Upload Video"
                description="Upload your main video file."
              >
                {!formData.video ? (
                  <button
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    className="w-full h-[350px] border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center gap-5 hover:bg-hover transition-all"
                  >
                    <div className="w-20 h-20 rounded-full bg-background flex items-center justify-center text-4xl">
                      <FiUpload />
                    </div>

                    <div className="text-center">
                      <h3 className="text-lg font-semibold">
                        Drag and drop video files to upload
                      </h3>

                      <p className="text-secondaryText text-sm mt-2">
                        Videos stay private until published.
                      </p>
                    </div>

                    <div className="px-5 py-3 rounded-full bg-white text-black font-medium text-sm">
                      Select Files
                    </div>
                  </button>
                ) : (
                  <div className="rounded-3xl overflow-hidden border border-border bg-background">
                    <video
                      controls
                      className="w-full h-[320px] object-cover"
                      src={URL.createObjectURL(formData.video)}
                    />

                    <div className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-card flex items-center justify-center text-xl shrink-0">
                          <FiVideo />
                        </div>

                        <div className="min-w-0">
                          <p className="font-medium truncate">
                            {formData.video.name}
                          </p>

                          <p className="text-xs text-secondaryText mt-1">
                            {(formData.video.size / (1024 * 1024)).toFixed(2)}{" "}
                            MB
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={removeVideo}
                        className="icon-btn shrink-0"
                      >
                        <FiX />
                      </button>
                    </div>
                  </div>
                )}

                {errors.video && (
                  <p className="text-red-500 text-sm mt-3">{errors.video}</p>
                )}

                <input
                  hidden
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                />
              </SectionCard>

              {/* PUBLISH */}

              <SectionCard
                title="Publish"
                description="Finalize upload settings."
              >
                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full h-14 rounded-2xl bg-white text-black font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? "Uploading Video..." : "Upload Video"}
                </button>

                <div className="mt-5 text-sm text-secondaryText space-y-2">
                  <p>• Supported formats: MP4, MOV, WEBM</p>
                  <p>• Max upload size: 100MB Garibi :(</p>
                  <p>• Processing may take some time.</p>
                </div>
              </SectionCard>
            </div>
          </form>
        </div>
      </section>
    </AppShell>
  );
}
