import Image from "next/image";

const DEFAULT_AVATAR = "https://res.cloudinary.com/dvhqwwpdl/image/upload/v1777532041/default-avatar_frnvfo.jpg";

type Props = {
  profilePicture?: string;

  commentInput: string;

  setCommentInput: (value: string) => void;

  handleCommentBtn: () => void;

  commentLoading?: boolean;
};

const CommentInput = ({
  profilePicture,
  commentInput,
  setCommentInput,
  handleCommentBtn,
  commentLoading,
}: Props) => {
  return (
    <div className="flex gap-3 items-start">
      <Image
        src={profilePicture || DEFAULT_AVATAR}
        alt="user"
        width={40}
        height={40}
        className="rounded-full w-10 h-10 object-cover"
      />

      <div className="flex-1">
        <input
          type="text"
          placeholder="Add a comment..."
          className="w-full bg-transparent border-b border-white/20 py-2 outline-none focus:border-white transition"
          value={commentInput}
          onChange={(e) =>
            setCommentInput(e.target.value)
          }
        />

        <div className="flex justify-end gap-3 mt-3">
          <button
            onClick={() => setCommentInput("")}
            className="px-4 py-2 rounded-full hover:bg-white/10 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleCommentBtn}
            disabled={
              !commentInput.trim() ||
              commentLoading
            }
            className="px-5 py-2 rounded-full bg-white text-black font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {commentLoading
              ? "Posting..."
              : "Comment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentInput;