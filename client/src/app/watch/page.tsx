import VideoContainer from "@/components/VideoContainer";
import VideoStreamingContainer from "@/components/VideoStreamingContainer";
import Image from "next/image";
import { BsSave } from "react-icons/bs";
import { PiShareFat } from "react-icons/pi";
import { SlDislike, SlLike } from "react-icons/sl";
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Youtube | Watch',
  description: 'Watch your favorite YouTube videos anytime, anywhere.',
};

const WatchPage = async () => {
  return (
    <main className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8 px-3 sm:px-5 lg:px-8 py-5 lg:py-8 max-w-[1800px] mx-auto">
      {/* LEFT SIDE */}
      <section className="min-w-0">
        <VideoStreamingContainer />

        {/* VIDEO INFO */}
        <div className="mt-4">
          {/* TITLE */}
          <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold leading-snug">
            The Fundamentals of Node.js Course Trailer | Master the Core
            Concepts
          </h1>

          {/* CHANNEL + ACTIONS */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mt-4">
            {/* CHANNEL INFO */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* AVATAR */}
              <div className="shrink-0">
                <Image
                  src="https://yt3.googleusercontent.com/QQi62BHmnTzE4t3QuLXYAbhbOJXz3Xs0dqps_u_9S4BKutYQ0uL-r2gPxDbU3JFVnKpW69pcqA=s160-c-k-c0x00ffffff-no-rj"
                  alt="Channel Avatar"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              </div>

              {/* DETAILS */}
              <div>
                <h2 className="font-medium text-sm sm:text-base">
                  Anurag Singh Procodrr
                </h2>

                <p className="text-xs sm:text-sm text-zinc-400">
                  114K subscribers
                </p>
              </div>

              {/* SUBSCRIBE */}
              <button className="h-10 px-5 rounded-full bg-white text-black font-semibold hover:opacity-90 transition cursor-pointer">
                Subscribe
              </button>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap items-center gap-3">
              {/* LIKE/DISLIKE */}
              <div className="flex items-center rounded-full bg-white/10 overflow-hidden">
                <button className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 transition border-r border-white/10">
                  <SlLike className="size-5" />
                  <span className="font-medium text-sm">15K</span>
                </button>

                <button className="px-4 py-2 hover:bg-white/10 transition">
                  <SlDislike className="size-5" />
                </button>
              </div>

              {/* SHARE */}
              <button className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 hover:bg-white/20 transition">
                <PiShareFat className="size-5" />
                <span className="font-medium text-sm">Share</span>
              </button>

              {/* SAVE */}
              <button className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 hover:bg-white/20 transition">
                <BsSave className="size-5" />
                <span className="font-medium text-sm">Save</span>
              </button>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="mt-5 rounded-xl bg-white/5 p-4">
            <p className="text-sm leading-relaxed text-zinc-300">
              Learn the fundamentals of Node.js and backend development in this
              beginner-friendly course trailer.
            </p>
          </div>
        </div>
      </section>

      {/* RIGHT SIDE */}
      <aside className="xl:sticky xl:top-20 h-fit">
        <VideoContainer
          className="
            grid
            grid-cols-1
            gap-4
          "
        />
      </aside>
    </main>
  );
};

export default WatchPage;