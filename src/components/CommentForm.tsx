import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { useDb } from "@/hooks/usedb";
import { SubmitHandler, useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { useAuthStore } from "@/store/Auth";
import { IComment } from "@/types/models";

function CommentForm({
  onType,
  typeId,
  onAdd,
}: {
  onType: string;
  typeId: string | undefined;
  onAdd: (data: IComment) => void;
}) {
  const { addNewComment } = useDb();
  const { user } = useAuthStore();

  const form = useForm({
    defaultValues: {
      comment: "",
    },
  });

  const { handleSubmit, control } = form;

  const { mutate: addComment } = useMutation({
    mutationKey: ["comments"],
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
    onError(error, variables, context) {
      // console.log("Add Comment error", error, variables, context);
    },
    onSuccess(data, variables, context) {
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
    addComment({
      comment: values.comment,
      type: onType,
      typeId,
      authorId: user.$id,
    });
  };

  return (
    <div className="border-b-2 py-1">
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
            Add Comment
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default CommentForm;
