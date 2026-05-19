import clsx from "clsx";
import Card from "./Card";

type props = {
  className?: string;
};

const VideoContainer = ({ className }: props) => {
  return (
    <section className={className}>
      {Array.from({ length: 10 }).map((_, index) => (
        <Card key={index} />
      ))}
    </section>
  );
};

export default VideoContainer;
