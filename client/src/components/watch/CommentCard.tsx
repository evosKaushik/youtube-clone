"use client";

import { dislikeCommentApi, likeCommentApi } from "@/api/commentApi";
import { translateApi } from "@/api/translateApi";
import { useUser } from "@/libs/AuthContext";

import Image from "next/image";
import { useCallback, useState } from "react";

import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { LuLanguages } from "react-icons/lu";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dvhqwwpdl/image/upload/v1777532041/default-avatar_frnvfo.jpg";

type Props = {
  comment: any;
};

const CommentCard = ({ comment }: Props) => {
  const { user } = useUser();

  const [likes, setLikes] = useState<number>(comment?.likes?.length ?? 0);
  const [dislikes, setDislikes] = useState<number>(comment?.dislikes?.length ?? 0);

  const [isLiked, setIsLiked] = useState(
    comment?.likes?.includes(user?._id) ?? false,
  );

  const [isDisliked, setIsDisliked] = useState(
    comment?.dislikes?.includes(user?._id) ?? false,
  );

  const [translatedText, setTranslatedText] = useState("");
  const [showTranslated, setShowTranslated] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);
  const [translateLoading, setTranslateLoading] = useState(false);

  const handleLike = useCallback(async () => {
    if (!user || actionLoading) return;

    const prevState = {
      likes,
      dislikes,
      isLiked,
      isDisliked,
    };

    try {
      setActionLoading(true);

      if (isLiked) {
        setLikes((prev: number) => prev - 1);
        setIsLiked(false);
      } else {
        setLikes((prev: number) => prev + 1);

        if (isDisliked) {
          setDislikes((prev: number) => prev - 1);
        }

        setIsLiked(true);
        setIsDisliked(false);
      }

      await likeCommentApi(comment?._id);
    } catch (error) {
      console.error(error);

      setLikes(prevState.likes);
      setDislikes(prevState.dislikes);
      setIsLiked(prevState.isLiked);
      setIsDisliked(prevState.isDisliked);
    } finally {
      setActionLoading(false);
    }
  }, [
    user,
    actionLoading,
    likes,
    dislikes,
    isLiked,
    isDisliked,
    comment?._id,
  ]);

  const handleDislike = useCallback(async () => {
    if (!user || actionLoading) return;

    const prevState = {
      likes,
      dislikes,
      isLiked,
      isDisliked,
    };

    try {
      setActionLoading(true);

      if (isDisliked) {
        setDislikes((prev) => prev - 1);
        setIsDisliked(false);
      } else {
        setDislikes((prev) => prev + 1);

        if (isLiked) {
          setLikes((prev: number) => prev - 1);
        }

        setIsDisliked(true);
        setIsLiked(false);
      }

      await dislikeCommentApi(comment?._id);
    } catch (error) {
      console.error(error);

      setLikes(prevState.likes);
      setDislikes(prevState.dislikes);
      setIsLiked(prevState.isLiked);
      setIsDisliked(prevState.isDisliked);
    } finally {
      setActionLoading(false);
    }
  }, [
    user,
    actionLoading,
    likes,
    dislikes,
    isLiked,
    isDisliked,
    comment?._id,
  ]);

  const handleTranslate = useCallback(async () => {
    if (translateLoading) return;

    // Already translated -> toggle
    if (translatedText) {
      setShowTranslated((prev) => !prev);
      return;
    }

    try {
      setTranslateLoading(true);

      const response = await translateApi(comment?.body);

      setTranslatedText(response?.translatedText || "");
      setShowTranslated(true);
    } catch (error) {
      console.error(error);
    } finally {
      setTranslateLoading(false);
    }
  }, [translatedText, translateLoading, comment?.body]);

  return (
    <div className="flex gap-3">
      {/* AVATAR */}
      <Image
        src={comment?.userId?.profilePicture || DEFAULT_AVATAR}
        alt={comment?.userId?.name || "user"}
        width={40}
        height={40}
        className="h-10 w-10 rounded-full object-cover"
      />

      {/* CONTENT */}
      <div className="flex-1 min-w-0">
        {/* HEADER */}
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="font-medium text-sm">
            @{comment?.userId?.username || "unknown"}
          </h4>

          {comment?.userId?.city && (
            <span className="text-xs text-zinc-500">
              • {comment.userId.city}
            </span>
          )}

          <span className="text-xs text-zinc-400">just now</span>
        </div>

        {/* COMMENT */}
        <p className="text-sm text-zinc-300 mt-1 leading-relaxed break-words whitespace-pre-line">
          {showTranslated && translatedText
            ? translatedText
            : comment?.body}
        </p>

        {/* ACTIONS */}
        <div className="flex items-center gap-5 mt-3">
          {/* LIKE */}
          <button
            onClick={handleLike}
            disabled={actionLoading}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition disabled:opacity-50 cursor-pointer"
          >
            <FaThumbsUp
              size={16}
              className={isLiked ? "text-white" : ""}
            />

            <span className="text-xs">{likes}</span>
          </button>

          {/* DISLIKE */}
          <button
            onClick={handleDislike}
            disabled={actionLoading}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition disabled:opacity-50 cursor-pointer"
          >
            <FaThumbsDown
              size={16}
              className={isDisliked ? "text-white" : ""}
            />

            <span className="text-xs">{dislikes}</span>
          </button>

          {/* TRANSLATE */}
          <button
            onClick={handleTranslate}
            disabled={translateLoading}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition text-xs disabled:opacity-50"
          >
            <LuLanguages size={16} />

            {translateLoading
              ? "Translating..."
              : translatedText
                ? showTranslated
                  ? "Show Original"
                  : "Translate to Eng"
                : "Translate to Eng"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;