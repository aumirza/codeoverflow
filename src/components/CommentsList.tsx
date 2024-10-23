import { cn } from "@/lib/utils";
import { IComment } from "@/types/models";
import { timeAgo } from "@/utils/time-ago";
import React from "react";

function CommentsList({ comments }: { comments: IComment[] }) {
  return (
    <div className="pl-5">
      {comments.length > 0 ? (
        comments.map((comment, i) => (
          <div
            className={cn(
              "flex border-b-2 border-gray-200 pb-1 ",
              i == 0 ? "border-t-2" : ""
            )}
            key={comment.$id}
          >
            <span>{comment.content} - </span>
            <span className="text-primary mr-5">{comment.author.name}</span>
            <span>{timeAgo(comment.$createdAt)}</span>
          </div>
        ))
      ) : (
        <div className="">No comments yet</div>
      )}
    </div>
  );
}

export default CommentsList;
