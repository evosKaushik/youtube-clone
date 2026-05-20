import { cn } from "@/libs/utils";
import Image from "next/image";
import Link from "next/link";

import { RiMoreLine } from "react-icons/ri";

type props = {
  className?: string;
};

const HistoryCard = ({ className }: props) => {
  return (
    <article className={cn("w-full", className ?? "")}>
      <Link
        href={`/watch?v=123`}
        className="group flex gap-4"
      >
        {/* Thumbnail */}
        <div
          className="
            relative
            h-[150px]
            min-w-[260px]
            overflow-hidden
            rounded-xl
          "
        >
          <Image
            src="https://i.ytimg.com/vi/RdkoOdZYNGw/hqdefault.jpg"
            alt="Video Thumbnail"
            fill
            className="
              object-cover
              transition-transform
              duration-300
              group-hover:scale-105
            "
          />

          {/* Duration */}
          <span
            className="
              absolute
              bottom-2
              right-2
              rounded
              bg-black/80
              px-1.5
              py-0.5
              text-xs
              font-medium
              text-white
            "
          >
            22:15
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-1 justify-between gap-4">
          <div className="max-w-[700px]">
            <h3
              className="
                line-clamp-2
                text-lg
                font-semibold
                text-white
              "
            >
              The Fundamentals of Node.js Course Trailer | Master the Core
              Concepts
            </h3>

            <p className="mt-2 text-sm text-zinc-400">
              Anurag Singh Procodrr • 29K views • 1 year ago
            </p>

            <p
              className="
                mt-3
                line-clamp-2
                text-sm
                text-zinc-400
              "
            >
              Learn Node.js fundamentals from scratch and understand backend
              systems with real-world examples and projects.
            </p>
          </div>

          <button
            className="
              h-fit
              rounded-full
              p-2
              transition-colors
              hover:bg-zinc-800
            "
          >
            <RiMoreLine className="text-xl" />
          </button>
        </div>
      </Link>
    </article>
  );
};

export default HistoryCard;