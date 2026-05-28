type Props = {
  className?: string;
  variant?: "grid" | "playlist";
  quantity: number;
};

const CardSkeleton = ({ variant = "grid", quantity = 4 }: Props) => {
  // PLAYLIST VARIANT
  if (variant === "playlist") {
    return Array.from({ length: quantity }).map((_, i) => (
      <div className="w-full animate-pulse my-4 "  key={i}>
        <div className="group flex gap-4">
          {/* Thumbnail */}
          <div className="relative h-[150px] min-w-[260px] overflow-hidden rounded-xl">
            <div className="bg-zinc-800 w-full h-full"></div>
          </div>

          {/* Content */}
          <div className="flex flex-1 justify-between gap-4">
            <div className="max-w-[700px] w-full space-y-4">
              <div className="bg-zinc-800 w-full h-8 rounded-md" />
              <div className="bg-zinc-800 w-full h-6 rounded-md" />
              <div className="bg-zinc-800 w-full h-6 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    ));
  }

  //   // GRID VARIANT
  //   return (
  //     <article className={cn("w-full cursor-pointer", className)}>
  //       <Link href={`/watch?v=${video._id}`}>
  //         {/* Thumbnail */}
  //         <div className="relative w-full overflow-hidden rounded-xl">
  //           <Image
  //             src={video.thumbnailURL}
  //             alt={video.name}
  //             width={500}
  //             height={300}
  //             className="aspect-video h-full w-full object-cover"
  //           />
  //         </div>

  //         {/* Content */}
  //         <div className="mt-3 flex gap-3">
  //           {/* Avatar */}
  //           <div className="shrink-0">
  //             <Image
  //               src={video?.creatorId?.profilePicture}
  //               alt={video.creatorId.channelName}
  //               width={40}
  //               height={40}
  //               className="rounded-full"
  //             />
  //           </div>

  //           {/* Info */}
  //           <div className="flex flex-col">
  //             <h3 className="line-clamp-2 text-sm font-semibold text-white">
  //               {video.name}
  //             </h3>

  //             <p className="mt-1 text-sm text-zinc-400">
  //               {video.creatorId.channelName}
  //             </p>

  //             <p className="text-sm text-zinc-400">29K views • {timeAgo}</p>
  //           </div>
  //         </div>
  //       </Link>
  //     </article>
  //   );
};

export default CardSkeleton;
