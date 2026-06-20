import { cn, formatDuration, formatTimeAgo, formatViews } from "@/libs/utils";
import { Video } from "@/types/entities";
import Image from "next/image";
import Link from "next/link";
import { RiMoreLine } from "react-icons/ri";

type Props = {
  className?: string;
  video: Video;
  variant?: "grid" | "playlist";
};

const VideoCard = ({ className = "not-last-of-type:", video, variant = "grid" }: Props) => {
  const timeAgo = formatTimeAgo(video.createdAt);
  const duration = formatDuration(video.duration);

  // PLAYLIST VARIANT
  if (variant === "playlist") {
    return (
      <article className={cn("w-full", className)}>
        <Link href={`/watch?v=${video._id}`} className="group flex gap-4">
          {/* Thumbnail */}
          <div className="relative h-[150px] min-w-[260px] overflow-hidden rounded-xl">
            <Image
              src={video.thumbnailURL}
              alt={video.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {duration && (
              <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
                {duration}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-1 justify-between gap-4">
            <div className="max-w-[700px]">
              <h3 className="line-clamp-2 text-lg font-semibold text-text">
                {video.name}
              </h3>

              <p className="mt-2 text-sm text-secondaryText">
                {video.creatorId.channelName} • {formatViews(video.views)} • {timeAgo}
              </p>

              <p className="mt-3 line-clamp-2 text-sm text-secondaryText">
                {video.description}
              </p>
            </div>

            <button className="h-fit rounded-full p-2 transition-colors hover:bg-hover">
              <RiMoreLine className="text-xl" />
            </button>
          </div>
        </Link>
      </article>
    );
  }

  // GRID VARIANT
  return (
    <article className={cn("w-full cursor-pointer", className)}>
      <Link href={`/watch?v=${video._id}`}>
        {/* Thumbnail */}
        <div className="relative w-full overflow-hidden rounded-xl">
          <Image
            src={video.thumbnailURL}
            alt={video.name}
            width={500}
            height={300}
            className="aspect-video h-full w-full object-cover"
          />
          {duration && (
            <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
              {duration}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="mt-3 flex gap-3">
          {/* Avatar */}
          <div className="shrink-0">
            <Image
              src={video?.creatorId?.profilePicture || "https://res.cloudinary.com/dvhqwwpdl/image/upload/v1777532041/default-avatar_frnvfo.jpg"}
              alt={video?.creatorId?.channelName || "Channel avatar"}
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <h3 className="line-clamp-2 text-sm font-semibold text-text">
              {video.name}
            </h3>

            <p className="mt-1 text-sm text-secondaryText">
              {video.creatorId.channelName}
            </p>

            <p className="text-sm text-secondaryText">{formatViews(video.views)} • {timeAgo}</p>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default VideoCard;
