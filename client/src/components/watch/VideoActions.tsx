import { BsSave } from "react-icons/bs";
import { PiShareFat } from "react-icons/pi";
import { SlDislike, SlLike } from "react-icons/sl";

type Props = {
  likes: number;

  onLike: () => void;

  onSave: () => void;

  loading?: boolean;
};

const VideoActions = ({
  likes,
  onLike,
  onSave,
  loading,
}: Props) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* LIKE */}
      <div className="flex items-center rounded-full bg-white/10 overflow-hidden">
        <button
          onClick={onLike}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 transition border-r border-white/10 disabled:opacity-50"
        >
          <SlLike className="size-5" />

          <span className="font-medium text-sm">
            {likes}
          </span>
        </button>

        <button className="px-4 py-2 hover:bg-white/10 transition">
          <SlDislike className="size-5" />
        </button>
      </div>

      {/* SHARE */}
      <button className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 hover:bg-white/20 transition">
        <PiShareFat className="size-5" />

        <span className="font-medium text-sm">
          Share
        </span>
      </button>

      {/* SAVE */}
      <button
        onClick={onSave}
        className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 hover:bg-white/20 transition"
      >
        <BsSave className="size-5" />

        <span className="font-medium text-sm">
          Save
        </span>
      </button>
    </div>
  );
};

export default VideoActions;