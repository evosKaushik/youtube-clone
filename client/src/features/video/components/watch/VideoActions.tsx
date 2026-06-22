import { BsSave, BsSaveFill } from "react-icons/bs";
import { FaDownload, FaThumbsUp } from "react-icons/fa";
import { PiShareFat } from "react-icons/pi";
import { SlDislike, SlLike } from "react-icons/sl";

type Props = {
  likes: number;
  isLiked?: boolean;
  isSaved?: boolean;

  onLike: () => void;
  onDislike?: () => void;
  onSave: () => void;
  onDownload: () => void;

  loading?: boolean;
};

const VideoActions = ({ likes, isLiked = false, isSaved = false, onLike, onDislike, onDownload, onSave, loading }: Props) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* LIKE */}
      <div className="flex items-center rounded-full bg-card border border-border overflow-hidden">
        <button
          onClick={onLike}
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-2 hover:bg-hover transition border-r border-border disabled:opacity-50 ${isLiked ? "text-white" : "text-text"}`}
        >
          {isLiked ? <FaThumbsUp className="size-5" /> : <SlLike className="size-5" />}

          <span className="font-medium text-sm">{likes}</span>
        </button>

        <button onClick={onDislike} className="px-4 py-2 hover:bg-hover transition text-text">
          <SlDislike className="size-5" />
        </button>
      </div>

      {/* SHARE */}
      <button className="flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2 hover:bg-hover transition">
        <PiShareFat className="size-5 text-text" />

        <span className="font-medium text-sm text-text">Share</span>
      </button>

      {/* Download */}
      <button
        onClick={onDownload}
        className="flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2 hover:bg-hover transition"
      >
        <FaDownload className="size-5 text-text" />

        <span className="font-medium text-sm text-text">Download</span>
      </button>
      {/* SAVE */}
      <button
        onClick={onSave}
        className={`flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2 hover:bg-hover transition ${isSaved ? "text-white" : "text-text"}`}
      >
        {isSaved ? <BsSaveFill className="size-5" /> : <BsSave className="size-5" />}

        <span className="font-medium text-sm">{isSaved ? "Saved" : "Save"}</span>
      </button>
    </div>
  );
};

export default VideoActions;
