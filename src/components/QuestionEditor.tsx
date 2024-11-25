"use client";

import React, { useState } from "react";
import { Input } from "./ui/input";
import ShimmerButton from "./magicui/shimmer-button";
import { BeamCard } from "./magicui/beam-card";
import { TagInput, Tag } from "emblor";
import { ImageInput } from "./ImageInput";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import MarkdownEditor from "./MarkdownEditor";
import { useAuthStore } from "@/store/Auth";
import { useMutation } from "@tanstack/react-query";
import { useDb } from "@/hooks/usedb";
import { toast } from "sonner";
import { IQuestion } from "@/types/models";
import { questionSchema } from "@/schemas/questionSchema";

const QuestionEditor = ({ question }: { question?: IQuestion }) => {
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  const { createQuestion, updateQuestion } = useDb();

  const form = useForm<z.infer<typeof questionSchema>>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      title: question ? question.title : "",
      content: question ? question.content : "",
      tags: question
        ? question.tags.map((tag) => ({ text: tag, id: tag.toLowerCase() }))
        : [],
      attachment:
        question && question.attachment
          ? [
              {
                file: new File([""], question.attachment),
                preview: question.attachment,
              },
            ]
          : [],
    },
  });

  const { user } = useAuthStore();

  const { mutateAsync: addQuestion } = useMutation({
    mutationFn: ({
      title,
      content,
      authorId,
      tags,
      file,
    }: {
      title: string;
      content: string;
      authorId: string;
      tags: string[];
      file?: File;
    }) => createQuestion(title, content, authorId, tags, file),
    mutationKey: ["addQuestion"],
    onSuccess: (data) => {
      toast.success("Question added successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutateAsync: updateQuestionMutation } = useMutation({
    mutationKey: ["updateQuestion"],
    mutationFn: ({
      id,
      title,
      content,
      tags,
      file,
    }: {
      id: string;
      title: string;
      content: string;
      tags: string[];
      file?: File;
    }) =>
      updateQuestion(id, title, content, tags, question?.attachmentId, file),
    onSuccess: (data) => {
      toast.success("Question updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const {
    control,
    register,
    setError,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit: SubmitHandler<z.infer<typeof questionSchema>> = async (
    values
  ) => {
    let file = undefined;
    if (values.attachment && values.attachment.length !== 0)
      file = values.attachment[0].file;
    const { title, content } = values;
    const tags = values.tags.map((tag) => tag.text);
    if (!user?.$id) return;
    const authorId = user?.$id;
    if (question) {
      // check if empty file that i created
      if (file && file.size === 0) file = undefined;
      await updateQuestionMutation({
        id: question.$id,
        title,
        content,
        tags,
        file,
      });
    } else {
      await addQuestion({ title, content, authorId, tags, file });
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-col gap-5">
            <div className="">
              <span className="text-3xl font-semibold">
                {question ? "Edit" : "Add"} Question
              </span>
            </div>
            <BeamCard duration={14}>
              <span>Writing a good question.</span>
              <ul className="text-xs list-inside list-disc">
                <li>Summarize your problem in a one-line title. </li>
                <li>Describe your problem in more detail. </li>
                <li>
                  Describe what you tried and what you expected to happen.{" "}
                </li>
                <li>
                  Add “tags” which help surface your question to members of the
                  community.
                </li>
              </ul>
            </BeamCard>
            <BeamCard>
              <span className="text">Title</span>
              <span className="text-xs text-gray-600">
                Give a proper title for your question
              </span>
              <Input
                className="mt-2"
                placeholder="Title"
                {...register("title")}
              />
            </BeamCard>
            <MarkdownEditor control={control} />
            <BeamCard>
              <ImageInput
                name="attachment"
                control={control}
                multiple={false}
              />
            </BeamCard>
            <BeamCard>
              <span>Add Tags</span>
              <span className="text-xs text-gray-600">
                Add up to 5 tags (separated by comma&apos;s)
              </span>
              <FormField
                control={control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <TagInput
                        {...field}
                        maxTags={5}
                        styleClasses={{
                          input: "h-10",
                          inlineTagsContainer: "mt-2 px-2",
                          tag: {
                            body: "pl-2 rounded",
                          },
                        }}
                        placeholder="Enter a topic"
                        tags={field.value}
                        setTags={(newTags) => {
                          // setTags(newTags);
                          setValue("tags", newTags as [Tag, ...Tag[]]);
                        }}
                        activeTagIndex={activeTagIndex}
                        setActiveTagIndex={setActiveTagIndex}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </BeamCard>
            {errors.root ? (
              <span className="text-red-100">{errors.root.message}</span>
            ) : null}
            <div className="">
              <ShimmerButton disabled={isSubmitting}>
                {isSubmitting
                  ? "Loading..."
                  : question
                  ? "Update Question"
                  : "Add Question"}
              </ShimmerButton>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default QuestionEditor;
