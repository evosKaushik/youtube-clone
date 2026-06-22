type Props = {
  comments?: number;
  videos?: number;
};

const WatchSkeleton = ({
  comments = 3,
  videos = 4,
}: Props) => {
  return (
    <main className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8 px-3 sm:px-5 lg:px-8 py-5 lg:py-8 max-w-[1800px] mx-auto animate-pulse">
      {/* LEFT */}
      <section>
        <div className="w-full aspect-video bg-card rounded-2xl" />

        <div className="h-8 w-2/3 bg-card rounded mt-5" />

        <div className="flex gap-4 mt-6">
          <div className="w-12 h-12 rounded-full bg-card" />

          <div className="flex-1">
            <div className="h-5 w-40 bg-card rounded" />

            <div className="h-4 w-24 bg-card rounded mt-2" />
          </div>
        </div>

        <div className="h-32 bg-card rounded-xl mt-6" />

        <div className="mt-10 space-y-6">
          {Array.from({ length: comments }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-card" />

              <div className="flex-1">
                <div className="h-4 w-32 bg-card rounded" />

                <div className="h-4 w-full bg-card rounded mt-2" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RIGHT */}
      <aside className="space-y-4">
        {Array.from({ length: videos }).map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-xl bg-card"
          />
        ))}
      </aside>
    </main>
  );
};

export default WatchSkeleton;