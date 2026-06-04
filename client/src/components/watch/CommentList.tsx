import CommentCard from "./CommentCard";

type Props = {
  comments: any[];
};

const CommentList = ({ comments }: Props) => {
  return (
    <div className="mt-8 flex flex-col gap-6">
      {comments.map((comment) => {
        
        return(
        <CommentCard
          key={comment._id}
          comment={comment}
        />
      )})}
    </div>
  );
};

export default CommentList;