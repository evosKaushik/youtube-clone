

import PlaylistVideoContainer from "@/components/PlaylistVideoContainer";

import { MdOutlineWatchLater } from "react-icons/md";
import { Metadata } from 'next';
import AppShell from "@/layout/AppShell";

export const metadata: Metadata = {
  title: 'Youtube | Watch Later',
  description: 'View and manage your videos saved for later viewing on YouTube.',
};

const WatchLaterPage = () => {

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
        <div className="flex-1">
          <div className="mb-8 flex items-center gap-3">
            <MdOutlineWatchLater className="text-4xl" />

            <h1 className="text-4xl font-bold">
              Watch Later
            </h1>
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

export default WatchLaterPage;