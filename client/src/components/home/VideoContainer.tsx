import Card from "../Card";

const VideoContainer = () => {
  return (
    <section
      className="
        grid 
        grid-cols-[repeat(auto-fit,minmax(300px,1fr))] 
        gap-5
        thin-scrollbar
      "
    >
      {Array.from({ length: 10 }).map((_, index) => (
        <Card key={index} />
      ))}
    </section>
  );
};

export default VideoContainer;
