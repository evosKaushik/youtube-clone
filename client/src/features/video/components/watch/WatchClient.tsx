"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import VideoStreamingContainer from "@/features/video/components/VideoStreamingContainer";
import VideoContainer from "@/features/video/components/VideoContainer";
import { useUser } from "@/libs/AuthContext";
import { downloadVideoById, updateLikesApi, fetchVideoByIdApi } from "@/api/videoApi";
import { addCommentApi } from "@/api/commentApi";
import { addPlaylistApi, getPlaylistApi } from "@/api/playlistApi";
import { formatViews } from "@/libs/utils";
import { Comment, Video, PlaylistItem } from "@/types/entities";
import toast from "react-hot-toast";
import CommentInput from "./CommentInput";
import CommentList from "./CommentList";
import VideoActions from "./VideoActions";
import WatchSkeleton from "./WatchSkeleton";

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
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const [currentVideo, setCurrentVideo] = useState<Video | null>(initialVideo);
  const [loading, setLoading] = useState(!initialVideo);
  const [error, setError] = useState<string | null>(null);
  const [isLimitExceeded, setIsLimitExceeded] = useState(false);
  const [allVideos] = useState(initialVideos);
  const [comments, setComments] = useState(initialComments);
  const [commentInput, setCommentInput] = useState("");
  const [likeLoading, setLikeLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Filter out current video from suggestions
  const suggestedVideos = useMemo(
    () => allVideos.filter((v) => v._id !== currentVideo?._id),
    [allVideos, currentVideo?._id]
  );

  // Check if user has liked this video
  useEffect(() => {
    if (!user || !currentVideo?._id) return;
    const checkLikeStatus = async () => {
      try {
        const data = await getPlaylistApi("like");
        const likedVideos = data?.videos || [];
        const isCurrentlyLiked = likedVideos.some(
          (item: PlaylistItem) => item?.videoId?._id === currentVideo._id
        );
        setIsLiked(isCurrentlyLiked);
      } catch (error) {
        console.error(error);
      }
    };
    checkLikeStatus();
  }, [user, currentVideo?._id]);

  // Check if user has saved this video to watch later
  useEffect(() => {
    if (!user || !currentVideo?._id) return;
    const checkSaveStatus = async () => {
      try {
        const data = await getPlaylistApi("watchLater");
        const savedVideos = data?.videos || [];
        const isCurrentlySaved = savedVideos.some(
          (item: PlaylistItem) => item?.videoId?._id === currentVideo._id
        );
        setIsSaved(isCurrentlySaved);
      } catch (error) {
        console.error(error);
      }
    };
    checkSaveStatus();
  }, [user, currentVideo?._id]);

  // Redirect guest users to login for interactive actions
  const requireAuth = (action: () => void) => {
    if (!user) {
      toast.error("Please login to use this feature");
      router.push("/signup");
      return;
    }
    action();
  };

  useEffect(() => {
    if (authLoading) return;

    const fetchVideo = async () => {
      // If we already have the initialVideo, no need to fetch it on the client
      if (initialVideo) {
        setCurrentVideo(initialVideo);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setIsLimitExceeded(false);

        const urlParams = new URLSearchParams(window.location.search);
        const videoId = urlParams.get("v");

        if (!videoId) {
          setError("Video ID not found.");
          setLoading(false);
          return;
        }

        const data = await fetchVideoByIdApi(videoId);
        if (data) {
          setCurrentVideo(data);
        } else {
          setError("Video not found");
        }
      } catch (err: any) {
        console.error("Error fetching video:", err);
        if (err.response) {
          if (err.response.status === 403) {
            setIsLimitExceeded(true);
            setError(err.response.data?.error || "Your daily watch limit is completed.");
          } else {
            setError(err.response.data?.error || "Failed to load video.");
          }
        } else {
          setError("Failed to load video.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [initialVideo, user, authLoading]);

  // Auto-play next video when current ends
  const getNextVideoId = useMemo(() => {
    if (suggestedVideos.length === 0) return null;
    return suggestedVideos[0]?._id;
  }, [suggestedVideos]);

  const handleVideoEnded = () => {
    if (getNextVideoId) {
      router.push(`/watch?v=${getNextVideoId}`);
    }
  };

  const handleNextVideo = () => {
    if (getNextVideoId) {
      router.push(`/watch?v=${getNextVideoId}`);
    }
  };

  const handleOpenComments = () => {
    const commentsSection = document.getElementById("comments-section");
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLike = async () => {
    if (!currentVideo?._id || likeLoading) return;

    try {
      setLikeLoading(true);

      const video = await updateLikesApi(currentVideo._id);

      setIsLiked(!isLiked);

      setCurrentVideo((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          likes: video?.updatedLikes || (isLiked ? prev.likes - 1 : prev.likes + 1),
        };
      });
    } catch (error: any) {
      console.error(error);
      if (error?.response?.data?.error?.includes("already like")) {
        setIsLiked(true);
      }
    } finally {
      setLikeLoading(false);
    }
  };

  const handleCommentBtn = async () => {
    if (!commentInput.trim()) return;

    if (!currentVideo?._id) return;

    if (!user) {
      toast.error("Please login to comment");
      router.push("/signup");
      return;
    }

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

  if (authLoading || loading) {
    return <WatchSkeleton />;
  }

  if (isLimitExceeded) {
    return (
      <main className="min-h-[85vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-card/60 backdrop-blur-md border border-border/40 rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto text-3xl mb-6">
            ⚠️
          </div>
          <h2 className="text-2xl font-bold mb-3 text-text">Watch Limit Reached</h2>
          <p className="text-secondaryText text-sm mb-6 leading-relaxed">
            {error || "Your daily watch limit is completed. Upgrade your subscription plan for unlimited streaming and downloads."}
          </p>
          <div className="space-y-3">
            <Link
              href="/subscription"
              className="flex items-center justify-center w-full h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-all shadow-lg hover:shadow-red-600/20"
            >
              Upgrade Plan
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center w-full h-12 rounded-xl bg-hover text-text font-medium transition-all hover:bg-border/60"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (error || !currentVideo) {
    return (
      <main className="min-h-[85vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-card/60 backdrop-blur-md border border-border/40 rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-card text-secondaryText rounded-2xl flex items-center justify-center mx-auto text-3xl mb-6">
            🔍
          </div>
          <h2 className="text-2xl font-bold mb-3 text-text">Unable to Load Video</h2>
          <p className="text-secondaryText text-sm mb-6 leading-relaxed">
            {error || "This video could not be found or loaded."}
          </p>
          <div className="space-y-3">
            <Link
              href="/"
              className="flex items-center justify-center w-full h-12 rounded-xl bg-hover text-text font-medium transition-all hover:bg-border/60"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8 px-3 sm:px-5 lg:px-8 py-5 lg:py-8 pb-20 lg:pb-8 max-w-[1800px] mx-auto">
      {/* LEFT */}
      <section className="min-w-0">
        <VideoStreamingContainer
          videoUrl={currentVideo?.videoURL || ""}
          videoId={currentVideo?._id || ""}
          onEnded={handleVideoEnded}
          onNextVideo={handleNextVideo}
          onOpenComments={handleOpenComments}
          onUnauthenticated={() => router.push("/signup")}
        />

        {/* INFO */}
        <div className="mt-4">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold leading-snug text-text">
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
                <h2 className="font-medium text-sm sm:text-base text-text">
                  {currentVideo?.creatorId?.channelName || "Unknown Channel"}
                </h2>

                <p className="text-xs sm:text-sm text-secondaryText">
                  {currentVideo?.creatorId?.subscriberCount
                    ? `${Intl.NumberFormat("en", {
                        notation: "compact",
                      }).format(
                        currentVideo.creatorId.subscriberCount,
                      )} subscribers`
                    : "No subscribers yet"}
                </p>
              </div>

              <button className="h-10 px-5 rounded-full bg-text text-background font-semibold hover:opacity-90 transition">
                Subscribe
              </button>
            </div>                      {/* ACTIONS */}
            <VideoActions
              likes={currentVideo?.likes || 0}
              isLiked={isLiked}
              isSaved={isSaved}
              loading={likeLoading}
              onLike={() => requireAuth(handleLike)}
              onSave={() => requireAuth(async () => {
                if (!currentVideo?._id) return;

                try {
                  await addPlaylistApi({
                    type: "watchLater",
                    vid: currentVideo._id,
                  });
                  setIsSaved(!isSaved);
                } catch (error) {
                  console.log(error);
                }
              })}
              onDownload={() => requireAuth(async () => {
                if (!currentVideo?._id) return;
                await downloadVideoById(currentVideo?._id);
              })}
            />
          </div>

          {/* DESCRIPTION */}
          <div className="mt-5 rounded-xl bg-card p-4">
            <p className="text-sm text-secondaryText mb-2">
              {formatViews(currentVideo?.views)} • {currentVideo?.likes ?? 0}{" "}
              likes
            </p>
            <p className="text-sm leading-relaxed text-text whitespace-pre-line">
              {currentVideo?.description || "No description available"}
            </p>
          </div>
        </div>

        {/* COMMENTS */}
        <div id="comments-section" className="w-full mt-10">
          <h3 className="text-xl font-semibold mb-5 text-text">
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
        <VideoContainer videos={suggestedVideos} className="grid grid-cols-1 gap-4" />
      </aside>
    </main>
  );
};

export default WatchClient;
