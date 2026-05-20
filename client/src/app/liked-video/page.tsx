"use client";


import PlaylistVideoContainer from "@/components/PlaylistVideoContainer";
import { useSidebarStore } from "@/store/useSidebarStore";
import { clsx } from "clsx";
import { AiOutlineLike } from "react-icons/ai";
import { MdOutlineWatchLater } from "react-icons/md";

const LikedVideoPage = () => {
    const isOpen = useSidebarStore((s) => s.isOpen);

    return (
        <section
            className={clsx(
                `
          min-h-screen
          bg-black
          text-white
          transition-all
          duration-300
          pt-2
        `,
                {
                    "ml-0 lg:ml-20": !isOpen,
                    "ml-0 lg:ml-60": isOpen,
                },
            )}
        >
            <div
                className="
          mx-auto
          flex
          w-full
          max-w-[1800px]
          gap-10
          px-4
          py-6
          lg:px-8
        "
            >
                {/* LEFT SIDE */}
                <div className="flex-1">
                    {/* Heading */}
                    <div className="mb-8 flex items-center gap-3">
                        <AiOutlineLike className="text-4xl " />

                        <h1 className="text-4xl font-bold">Liked Videos</h1>
                    </div>
                    <PlaylistVideoContainer
                        className="
                flex
                flex-col
                gap-6
              "
                        cardClassName="
                flex
                flex-row
                gap-4
              "
                    />
                </div>


            </div>
        </section>
    );
};

export default LikedVideoPage;