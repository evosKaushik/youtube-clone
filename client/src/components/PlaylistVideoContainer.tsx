"use client";

import VideoContainer from "./VideoContainer";
import { Video } from "@/types/entities";

type Props = {
  className?: string;
  cardClassName?: string;
  videos?: Video[] | null;
};

const PlaylistVideoContainer = ({ className, cardClassName, videos = [] }: Props) => {
  return (
    <VideoContainer
      className={className}
      cardClassName={cardClassName}
      videos={videos}
      variant="playlist"
    />
  );
};

export default PlaylistVideoContainer;
