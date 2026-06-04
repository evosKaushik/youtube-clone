"use client";

import { useState } from "react";
import Image from "next/image";
import VideoStreamingContainer from "@/components/VideoStreamingContainer";
import VideoContainer from "@/components/VideoContainer";
import { useUser } from "@/libs/AuthContext";
import { downloadVideoById, updateLikesApi } from "@/api/videoApi";
import { addCommentApi } from "@/api/commentApi";
import { addPlaylistApi } from "@/api/playlistApi";
import { formatViews } from "@/libs/utils";
import { Comment, Video } from "@/types/entities";
import CommentInput from "./CommentInput";
import CommentList from "./CommentList";
import VideoActions from "./VideoActions";

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

      const data: Comment | null = await addCommentApi({
        targetId: currentVideo._id,
        body: commentInput,
        targetType: "Video",
      });
      if (!data) return;
      const updatedComment: Comment = {
        _id: data?._id,
        body: commentInput,
        createdAt: data?.createdAt,
        userId: {
          _id: user?._id || "",
          name: user?.name || "Unknown",
          username: user?.username || "user",
          profilePicture: user?.profilePicture || DEFAULT_AVATAR,
        },
      };

      setComments((prev) => [updatedComment, ...prev]);

      setCommentInput("");
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
                  {currentVideo?.creatorId?.subscriberCount
                    ? `${Intl.NumberFormat("en", { notation: "compact" }).format(
                        currentVideo.creatorId.subscriberCount,
                      )} subscribers`
                    : "No subscribers yet"}
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
              onDownload={async ()=>{
                if (!currentVideo?._id) return;
                await downloadVideoById(currentVideo?._id)
                
              }}
            />
          </div>

          {/* DESCRIPTION */}
          <div className="mt-5 rounded-xl bg-white/5 p-4">
            <p className="text-sm text-zinc-400 mb-2">
              {formatViews(currentVideo?.views)} • {currentVideo?.likes ?? 0} likes
            </p>
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
