import HistoryCard from "./HistoryCard";

type props = {
  className?: string;
  cardClassName?: string;
};

const HistoryVideoContainer = ({
  className,
  cardClassName,
}: props) => {
  return (
    <section className={className}>
      {Array.from({ length: 10 }).map((_, index) => (
        <HistoryCard
          key={index}
          className={cardClassName}
        />
      ))}
    </section>
  );
};

export default HistoryVideoContainer;