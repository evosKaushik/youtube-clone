type Props = {
  videoUrl: string;
};

const VideoStreamingContainer = ({ videoUrl }: Props) => {
  return (
    <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black">
      <video
        src={videoUrl}
        controls
        autoPlay={false}
        className="w-full h-full"
      />
    </div>
  );
};

export default VideoStreamingContainer;