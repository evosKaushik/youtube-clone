import { cn } from "@/libs/utils";
import Image from "next/image";
import Link from "next/link";
import { RiMoreLine } from "react-icons/ri";

export type Creator = {
  _id: string;
  channelName: string;
  profilePicture: string;
  channelUsername: string
};

export type Video = {
  _id: string;
  name: string;
  description: string;
  thumbnailURL: string;
  videoURL: string;
  createdAt: string;
  likes: number;
  creatorId: Creator;
};

type Props = {
  className?: string;
  video: Video;
  variant?: "grid" | "playlist";
};

const VideoCard = ({ className = "not-last-of-type:", video, variant = "grid" }: Props) => {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();

    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
      { label: "second", seconds: 1 },
    ];

    const rtf = new Intl.RelativeTimeFormat("en", {
      numeric: "auto",
    });

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);

      if (count >= 1) {
        return rtf.format(
          -count,
          interval.label as Intl.RelativeTimeFormatUnit,
        );
      }
    }

    return "just now";
  };

  const timeAgo = formatTimeAgo(video.createdAt);

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

            <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
              22:15
            </span>
          </div>

          {/* Content */}
          <div className="flex flex-1 justify-between gap-4">
            <div className="max-w-[700px]">
              <h3 className="line-clamp-2 text-lg font-semibold text-white">
                {video.name}
              </h3>

              <p className="mt-2 text-sm text-zinc-400">
                {video.creatorId.channelName} • 29K views • {timeAgo}
              </p>

              <p className="mt-3 line-clamp-2 text-sm text-zinc-400">
                {video.description}
              </p>
            </div>

            <button className="h-fit rounded-full p-2 transition-colors hover:bg-zinc-800">
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
        </div>

        {/* Content */}
        <div className="mt-3 flex gap-3">
          {/* Avatar */}
          <div className="shrink-0">
            <Image
              src={video?.creatorId?.profilePicture}
              alt={video.creatorId.channelName}
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <h3 className="line-clamp-2 text-sm font-semibold text-white">
              {video.name}
            </h3>

            <p className="mt-1 text-sm text-zinc-400">
              {video.creatorId.channelName}
            </p>

            <p className="text-sm text-zinc-400">29K views • {timeAgo}</p>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default VideoCard;
