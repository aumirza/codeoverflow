import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Form, FormField } from "./ui/form";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "./ui/button";
import { useDb } from "@/hooks/usedb";
import { useAuthStore } from "@/store/Auth";
import { useMutation } from "@tanstack/react-query";

function AnswerForm({
  questionId,
  onAddAnswer,
}: {
  questionId: string;
  onAddAnswer: (answer: any) => void;
}) {
  const { createAnswer } = useDb();
  const { user } = useAuthStore();
  const { mutate: addAnswer } = useMutation({
    mutationKey: ["create-answer"],
    mutationFn: ({
      content,
      questionId,
      authorId,
    }: {
      content: string;
      questionId: string;
      authorId: string;
    }) => createAnswer(content, authorId, questionId),
    onSuccess: (data) => {
      onAddAnswer({
        ...data,
        votes: {
          total: 0,
          documents: [],
        },
        author: user,
        comments: {
          total: 0,
          documents: [],
        },
      });
      reset();
    },
  });
  const form = useForm({
    defaultValues: {
      content: "",
    },
  });

  const onSubmit: SubmitHandler<any> = (values: any) => {
    if (!user) return alert("Please login to answer");
    console.log(values);
    const authorId = user?.$id;
    addAnswer({ content: values.content, authorId, questionId });
  };

  const { control, handleSubmit, reset } = form;
  return (
    <div className="flex flex-col gap-2 mt-3">
      <h3 className="text-2xl">Your answer</h3>
      <Form {...form}>
        <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
          <FormField
            control={control}
            name="content"
            render={({ field }) => (
              <MDEditor
                className="mt-2"
                value={field.value}
                onChange={(v) => {
                  field.onChange(v);
                }}
              />
            )}
          />
          <div>
            <Button type="submit">Post Your Answer</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default AnswerForm;
