"use client";

import VideoContainer from "./VideoContainer";

type Props = {
  className?: string;
  cardClassName?: string;
};

const PlaylistVideoContainer = ({ className, cardClassName }: Props) => {
  return (
    <VideoContainer
      className={className}
      cardClassName={cardClassName}
      videos={[]}
      variant="playlist"
    />
  );
};

export default PlaylistVideoContainer;
