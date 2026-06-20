
import CardSkeleton from "@/components/ui/CardSkeleton";
import VideoCard from "./VideoCard";
import EmptyVideoState from "./watch/EmptyVideoState";
import { Video } from "@/types/entities";

type Props = {
  className?: string;
  cardClassName?: string;
  videos: Video[] | null;
  variant?: "grid" | "playlist";
};

const VideoContainer = ({
  className,
  cardClassName,
  videos,
  variant = "grid",
}: Props) => {
  if (videos === null) {
    return <CardSkeleton quantity={3} variant={variant} />;
  }

  return (
    <section className={className}>
      {videos?.length > 0 ? (
        videos?.map((video, i) => (
          <VideoCard
            key={video._id ?? i}
            video={video}
            variant={variant}
            className={cardClassName}
          />
        ))
      ) : (
        <EmptyVideoState />
      )}
    </section>
  );
};

export default VideoContainer;
