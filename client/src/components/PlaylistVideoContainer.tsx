import PlaylistCard from "./PlaylistCard";

type props = {
  className?: string;
  cardClassName?: string;
};

const PlaylistVideoContainer = ({
  className,
  cardClassName,
}: props) => {
  return (
    <section className={className}>
      {Array.from({ length: 10 }).map((_, index) => (
        <PlaylistCard
          key={index}
          className={cardClassName}
        />
      ))}
    </section>
  );
};

export default PlaylistVideoContainer;