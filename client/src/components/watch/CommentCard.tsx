import Image from "next/image";

const DEFAULT_AVATAR = "https://res.cloudinary.com/dvhqwwpdl/image/upload/v1777532041/default-avatar_frnvfo.jpg";

type Props = {
  comment: any;
};

const CommentCard = ({ comment }: Props) => {
  return (
    <div className="flex gap-3">
      <Image
        src={
          comment?.userId?.profilePicture ||
          DEFAULT_AVATAR
        }
        alt={comment?.userId?.name || "user"}
        width={40}
        height={40}
        className="rounded-full h-10 w-10 object-cover"
      />

      <div>
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-sm">
            @{comment?.userId?.username || "unknown"}
          </h4>

          <span className="text-xs text-zinc-400">
            just now
          </span>
        </div>

        <p className="text-sm text-zinc-300 mt-1 leading-relaxed break-words">
          {comment.body}
        </p>
      </div>
    </div>
  );
};

export default CommentCard;