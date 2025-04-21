import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { useDb } from "@/hooks/usedb";
import { SubmitHandler, useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { useAuthStore } from "@/store/Auth";
import { IComment } from "@/types/models";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function CommentForm({
  onType,
  typeId,
  comment,
  onAdd,
  className,
}: {
  onType: string;
  typeId: string | undefined;
  comment?: IComment;
  onAdd?: (data: IComment) => void;
  className?: string;
}) {
  const { addNewComment, updateComment } = useDb();
  const { user } = useAuthStore();

  const form = useForm({
    defaultValues: {
      comment: comment?.content ?? "",
    },
  });

  const { handleSubmit, control } = form;

  const { mutate: updateCommentMutation } = useMutation({
    mutationKey: ["update-comment"],
    mutationFn: ({
      comment,
      commentId,
    }: {
      comment: string;
      commentId: string;
    }) => updateComment(comment, commentId),
    onSuccess(data, variables, context) {
      if (onAdd)
        onAdd({
          ...data,
          author: user,
        });
      form.reset();
    },
    onError(error, variables, context) {
      toast("Error updating comment");
    },
  });

  const { mutate: addComment } = useMutation({
    mutationKey: ["add-comment"],
    mutationFn: ({
      comment,
      type,
      typeId,
      authorId,
    }: {
      comment: string;
      type: string;
      typeId: string;
      authorId: string;
    }) => addNewComment(comment, type, typeId, authorId),
    onMutate(variables) {
      // console.log("Add Comment", variables);
    },
    onError(error, variables, context) {
      // console.log("Add Comment error", error, variables, context);
    },
    onSuccess(data, variables, context) {
      if (onAdd)
        onAdd({
          ...data,
          author: user,
        });
      form.reset();
    },
  });

  const onSubmit: SubmitHandler<{ comment: string }> = (values) => {
    if (!typeId || !onType) return;
    if (!user) return alert("Please login to add comment");

    if (comment) {
      updateCommentMutation({
        comment: values.comment,
        commentId: comment.$id,
      });
      return;
    }

    addComment({
      comment: values.comment,
      type: onType,
      typeId,
      authorId: user.$id,
    });
  };

  return (
    <div className={cn(className, "border-b-2 py-1")}>
      <Form {...form}>
        <form className="flex gap-1 " onSubmit={handleSubmit(onSubmit)}>
          <FormField
            control={control}
            name="comment"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    className="w-full "
                    placeholder="Add a comment..."
                  />
                </FormControl>
              </FormItem>
            )}
          ></FormField>
          <Button type="submit" className="font-bold">
            {(comment ? "Update" : "Add") + " "}
            Comment
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default CommentForm;
