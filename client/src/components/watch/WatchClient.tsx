"use client";

import { useState } from "react";
import Image from "next/image";
import VideoStreamingContainer from "@/components/VideoStreamingContainer";
import VideoContainer from "@/components/VideoContainer";
import { Video } from "@/components/VideoCard";
import { useUser } from "@/libs/AuthContext";
import { updateLikesApi } from "@/api/videoApi";
import { addCommentApi } from "@/api/commentApi";
import { addPlaylistApi } from "@/api/playlistApi";
import CommentInput from "./CommentInput";
import CommentList from "./CommentList";
import VideoActions from "./VideoActions";

type UserId = {
  _id: string;
  name: string;
  profilePicture: string;
  username: string;
};

type Comment = {
  _id?: string;
  userId: UserId;
  body: string;
  createdAt?: string;
};

type Props = {
  initialVideo: Video | null;

  initialVideos: Video[];

  initialComments: Comment[];
};

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dvhqwwpdl/image/upload/v1777532041/default-avatar_frnvfo.jpg";

const WatchClient = ({
  initialVideo,
  initialVideos,
  initialComments,
}: Props) => {
  const { user } = useUser();

  const [currentVideo, setCurrentVideo] = useState(initialVideo);

  const [videos] = useState(initialVideos);

  const [comments, setComments] = useState(initialComments);

  const [commentInput, setCommentInput] = useState("");

  const [likeLoading, setLikeLoading] = useState(false);

  const [commentLoading, setCommentLoading] = useState(false);

  const handleLike = async () => {
    if (!currentVideo?._id || likeLoading) return;

    try {
      setLikeLoading(true);

      const video = await updateLikesApi(currentVideo._id);

      setCurrentVideo((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          likes: video?.updatedLikes || 0,
        };
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleCommentBtn = async () => {
    if (!commentInput.trim()) return;

    if (!currentVideo?._id) return;

    if (!user) return;

    try {
      setCommentLoading(true);

      const tempComment: Comment = {
        _id: crypto.randomUUID(),

        body: commentInput,

        createdAt: new Date().toISOString(),

        userId: {
          _id: user?._id || "",

          name: user?.name || "Unknown",

          username: user?.username || "user",

          profilePicture: user?.profilePicture || DEFAULT_AVATAR,
        },
      };

      setComments((prev) => [tempComment, ...prev]);

      setCommentInput("");

      await addCommentApi({
        videoId: currentVideo._id,
        body: tempComment.body,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setCommentLoading(false);
    }
  };

  if (!currentVideo) {
    return (
      <div className="h-screen flex items-center justify-center">
        Video not found
      </div>
    );
  }

  return (
    <main className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8 px-3 sm:px-5 lg:px-8 py-5 lg:py-8 max-w-[1800px] mx-auto">
      {/* LEFT */}
      <section className="min-w-0">
        <VideoStreamingContainer videoUrl={currentVideo?.videoURL || ""} />

        {/* INFO */}
        <div className="mt-4">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold leading-snug">
            {currentVideo?.name || "Untitled Video"}
          </h1>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mt-4">
            {/* CHANNEL */}
            <div className="flex items-center gap-3 flex-wrap">
              <Image
                src={currentVideo?.creatorId?.profilePicture || DEFAULT_AVATAR}
                alt="creator"
                width={48}
                height={48}
                className="rounded-full object-cover w-12 h-12"
              />

              <div>
                <h2 className="font-medium text-sm sm:text-base">
                  {currentVideo?.creatorId?.channelName || "Unknown Channel"}
                </h2>

                <p className="text-xs sm:text-sm text-zinc-400">
                  114K subscribers
                </p>
              </div>

              <button className="h-10 px-5 rounded-full bg-white text-black font-semibold hover:opacity-90 transition">
                Subscribe
              </button>
            </div>

            {/* ACTIONS */}
            <VideoActions
              likes={currentVideo?.likes || 0}
              loading={likeLoading}
              onLike={handleLike}
              onSave={async () => {
                if (!currentVideo?._id) return;

                try {
                  await addPlaylistApi({
                    type: "watchLater",
                    vid: currentVideo._id,
                  });
                } catch (error) {
                  console.log(error);
                }
              }}
            />
          </div>

          {/* DESCRIPTION */}
          <div className="mt-5 rounded-xl bg-white/5 p-4">
            <p className="text-sm leading-relaxed text-zinc-300 whitespace-pre-line">
              {currentVideo?.description || "No description available"}
            </p>
          </div>
        </div>

        {/* COMMENTS */}
        <div className="w-full mt-10">
          <h3 className="text-xl font-semibold mb-5">
            {comments.length} Comments
          </h3>

          <CommentInput
            profilePicture={user?.profilePicture}
            commentInput={commentInput}
            setCommentInput={setCommentInput}
            handleCommentBtn={handleCommentBtn}
            commentLoading={commentLoading}
          />

          <CommentList comments={comments} />
        </div>
      </section>

      {/* RIGHT */}
      <aside className="xl:sticky xl:top-20 h-fit">
        <VideoContainer videos={videos} className="grid grid-cols-1 gap-4" />
      </aside>
    </main>
  );
};

export default WatchClient;
