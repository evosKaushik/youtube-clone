type Props = {
  className?: string;
  variant?: "grid" | "playlist";
  quantity?: number;
};

const CardSkeleton = ({ variant = "grid", quantity = 4 }: Props) => {
  // PLAYLIST VARIANT
  if (variant === "playlist") {
    return Array.from({ length: quantity }).map((_, i) => (
      <div className="w-full animate-pulse my-4 " key={i}>
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

  // GRID VARIANT
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 "          
    >
      {Array.from({ length: variant === "grid" ? quantity * 3 :  quantity }).map((_, i) => (
        <div className="w-full animate-pulse" key={i}>
          {/* Thumbnail */}
          <div className="relative w-full overflow-hidden rounded-xl">
            <div className="aspect-video h-full w-full object-cover bg-zinc-800" />
          </div>
          {/* Content */}
          <div className="mt-3 flex gap-3">
            {/* Avatar */}
            <div className="shrink-0">
              <div className="rounded-full bg-zinc-800 h-12 w-12" />
            </div>
            {/* Info */}
            <div className="flex flex-col w-[80%]">
              <div className="bg-zinc-800 w-full h-6 rounded-md" />
              <div className="mt-3 bg-zinc-800 w-full h-5 rounded-md" />
              <div className="mt-3 bg-zinc-800 w-full h-5 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardSkeleton;
