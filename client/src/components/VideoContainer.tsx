  import Card from "./Card";

type props = {
  className?: string;
  videos: Array<any>;
};

const VideoContainer = ({ className, videos }: props) => {
  return (
    <section className={className}>
      {videos?.map((video, index) => (
        <Card key={index} video={video} />
      ))}
    </section>
  );
};

export default VideoContainer;
