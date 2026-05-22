import PlaylistVideoContainer from "@/components/PlaylistVideoContainer";
import { AiOutlineLike } from "react-icons/ai";
import { Metadata } from 'next';
import AppShell from "@/layout/AppShell";

export const metadata: Metadata = {
    title: 'Youtube | Liked Videos',
    description: 'View and manage your liked videos on YouTube.',
};

const LikedVideoPage = () => {


    return (
        <AppShell>
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
        </AppShell>
    );
};

export default LikedVideoPage;