import { cn } from "@/lib/utils";
import { IComment } from "@/types/models";
import Comment from "./Comment";

function CommentsList({
  comments,
  setComments,
}: {
  comments: IComment[];
  setComments: (comment: IComment[]) => void;
}) {
  const onDelete = (commentId: string) => {
    setComments(comments.filter((comment) => comment.$id !== commentId));
  };

  return (
    <div className="pl-5">
      {comments.length > 0 ? (
        comments.map((comment, i) => (
          <div
            key={comment.$id}
            className={cn(" ", i == 0 ? "border-t-2" : "")}
          >
            <Comment comment={comment} onDelete={onDelete} />
          </div>
        ))
      ) : (
        <div className="">No comments yet</div>
      )}
    </div>
  );
}

export default CommentsList;
