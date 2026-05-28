import VideoCard, { Video } from "./VideoCard";

type Props = {
  className?: string;
  cardClassName?: string;
  videos: Video[];
  variant?: "grid" | "playlist";
};

const VideoContainer = ({
  className,
  cardClassName,
  videos,
  variant = "grid",
}: Props) => {
  return (
    <section className={className}>
      {videos?.map((video) => (
        <VideoCard
          key={video._id}
          video={video}
          variant={variant}
          className={cardClassName}
        />
      ))}
    </section>
  );
};

export default VideoContainer;
