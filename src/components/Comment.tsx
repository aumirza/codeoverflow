import { cn } from "@/lib/utils";
import { IComment } from "@/types/models";
import { timeAgo } from "@/utils/time-ago";
import { EditIcon, Trash2Icon } from "lucide-react";
import { useAuthStore } from "@/store/Auth";
import { useState } from "react";
import CommentForm from "./CommentForm";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useDb } from "@/hooks/usedb";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

function Comment({
  comment: initialComment,
  onDelete,
}: {
  comment: IComment;
  onDelete?: (commentId: string) => void;
}) {
  const [comment, setComment] = useState<IComment>(initialComment);
  const { user } = useAuthStore();
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { deleteComment } = useDb();

  const onUpdate = (comment: IComment) => {
    setComment(comment);
    setIsEdit(false);
  };

  const { mutateAsync: deleteMutation } = useMutation({
    mutationKey: ["delete-comment"],
    mutationFn: deleteComment,
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: () => {
      setIsLoading(false);
    },
    onSuccess: () => {
      toast.success("Comment deleted successfully.");
      if (!onDelete) return;
      onDelete(comment.$id);
    },
    onError: (error) => {
      toast.error("Some error occured while deleting.");
    },
  });

  const DeleteHandler = () => {
    if (!comment) return;
    deleteMutation(comment.$id);
  };

  if (isEdit)
    return (
      <div className="flex w-full gap-1 items-center">
        <CommentForm
          comment={comment}
          typeId={comment.typeId}
          onType={comment.type}
          onAdd={onUpdate}
          className="flex-grow"
        />
        <Button onClick={() => setIsEdit(false)}>Cancel</Button>
      </div>
    );

  return (
    <div
      className={cn(
        "relative   flex justify-between border-b-2 border-gray-200 pb-1"
      )}
      key={comment.$id}
    >
      {isLoading ? (
        <div className="absolute flex justify-center w-full h-full rounded-lg bg-black opacity-50 gap-1 items-center">
          <div className="w-4 h-4 rounded-full border-2 animate-spin" />
        </div>
      ) : (
        ""
      )}

      <div className="flex">
        <span>{comment.content} - </span>
        <span className="text-primary mr-5">{comment.author.name}</span>
        <span>{timeAgo(comment.$createdAt)}</span>
      </div>
      {user?.$id === comment?.authorId && (
        <div className="flex gap-1">
          <EditIcon
            className="cursor-pointer"
            onClick={() => setIsEdit(!isEdit)}
          />
          <Dialog>
            <DialogTrigger asChild>
              <Trash2Icon className="cursor-pointer" />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Are you sure you want to delete this comment?
                </DialogTitle>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="destructive" onClick={DeleteHandler}>
                    Yes, Delete
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button variant="outline">No, Cancel</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}

export default Comment;
