import CardSkeleton from "./CardSkeleton";
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
      {videos.length ? (
        videos?.map((video, i) => (
          <VideoCard
            key={video._id ?? i}
            video={video}
            variant={variant}
            className={cardClassName}
          />
        ))
      ) : (
        <CardSkeleton quantity={3} variant={variant} />
      )}
    </section>
  );
};

export default VideoContainer;
