import React, { useState } from "react";
import CommentsList from "./CommentsList";
import CommentForm from "./CommentForm";
import { IComment } from "@/types/models";
import { Models } from "appwrite";

function Comments({
  data,
  onType,
  typeId,
}: {
  data: Models.DocumentList<IComment>;
  onType: string;
  typeId: string | undefined;
}) {
  const [comments, setComments] = useState(data?.documents ?? []);
  const handleAdd = (newComment: IComment) => {
    setComments((prev) => [...prev, newComment]);
  };
  return (
    <div className="flex flex-col gap-1">
      <CommentsList comments={comments} />
      <CommentForm onType={onType} typeId={typeId} onAdd={handleAdd} />
    </div>
  );
}

export default Comments;
