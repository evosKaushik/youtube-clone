import { cn } from "@/libs/utils";
import Image from "next/image";
import Link from "next/link";

type props = {
  className?: string;
  video: any;
};

const Card = ({ className, video }: props) => {
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

  const timeAgo = formatTimeAgo(video?.createdAt);

  return (
    <article className={cn("w-full cursor-pointer", className ?? "")}>
      <Link href={`/watch?v=${video?._id}`}>
        {/* Thumbnail Container */}
        <div className="relative w-full overflow-hidden rounded-xl">
          <Image
            src={video?.thumbnailURL || ""}
            alt="Video Thumbnail"
            width={500}
            height={300}
            className="h-full w-full object-cover aspect-video"
            loading="eager"
          />

          {/* Video Duration */}
          <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
            22:15
          </span>
        </div>

        {/* Content */}
        <div className="mt-3 flex gap-3">
          {/* Avatar */}
          <div className="shrink-0">
            <Image
              src="https://yt3.googleusercontent.com/QQi62BHmnTzE4t3QuLXYAbhbOJXz3Xs0dqps_u_9S4BKutYQ0uL-r2gPxDbU3JFVnKpW69pcqA=s160-c-k-c0x00ffffff-no-rj"
              alt="Channel Avatar"
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>

          {/* Video Info */}
          <div className="flex flex-col">
            {/* Title */}
            <h3 className="line-clamp-2 text-sm font-semibold text-white">
              {video.name}
            </h3>

            {/* Channel Name */}
            <p className="mt-1 text-sm text-zinc-400">
              {video?.creatorId.channelName}
            </p>

            {/* Views + Time */}
            <p className="text-sm text-zinc-400">29K views • {timeAgo || ""}</p>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default Card;
