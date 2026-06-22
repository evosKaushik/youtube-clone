import Image from "next/image";
import { useState } from "react";

const DEFAULT_AVATAR = "https://res.cloudinary.com/dvhqwwpdl/image/upload/v1777532041/default-avatar_frnvfo.jpg";

const SPECIAL_CHARS_REGEX = /[^a-zA-Z0-9\s.,!?'"@#_\-:;()&]/;

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
  const [error, setError] = useState("");

  const handleChange = (value: string) => {
    setCommentInput(value);
    if (error) setError("");
  };

  const handleSubmit = () => {
    if (!commentInput.trim() || commentLoading) return;

    // Validate for special characters on frontend
    if (SPECIAL_CHARS_REGEX.test(commentInput.trim())) {
      setError("Special characters are not allowed in comments");
      return;
    }

    setError("");
    handleCommentBtn();
  };

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
          className={`w-full bg-transparent border-b py-2 outline-none transition ${
            error
              ? "border-red-500 focus:border-red-500"
              : "border-border focus:border-text"
          }`}
          value={commentInput}
          onChange={(e) =>
            handleChange(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />

        {error && (
          <p className="text-xs text-red-500 mt-1.5">{error}</p>
        )}

        <div className="flex justify-end gap-3 mt-3">
          <button
            onClick={() => {
              setCommentInput("");
              setError("");
            }}
            className="px-4 py-2 rounded-full hover:bg-white/10 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
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