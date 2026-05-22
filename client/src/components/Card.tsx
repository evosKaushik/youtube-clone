import { cn } from "@/libs/utils";
import Image from "next/image";
import Link from "next/link";

type props = {
  className?: string ;
};

const Card = ({ className }: props) => {
  return (
    <article className={cn("w-full cursor-pointer", className ?? "")}>
      <Link href={`/watch?v=123`}>
        {/* Thumbnail Container */}
        <div className="relative w-full overflow-hidden rounded-xl">
          <Image
            src="https://i.ytimg.com/vi/RdkoOdZYNGw/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLCdUVo7N0hXbrFzY-336pq9ztcUNw"
            alt="Video Thumbnail"
            width={500}
            height={300}
            className="h-full w-full object-cover"
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
              The Fundamentals of Node.js Course Trailer | Master the Core
              Concepts
            </h3>

            {/* Channel Name */}
            <p className="mt-1 text-sm text-zinc-400">Anurag Singh Procodrr</p>

            {/* Views + Time */}
            <p className="text-sm text-zinc-400">29K views • 1 year ago</p>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default Card;
