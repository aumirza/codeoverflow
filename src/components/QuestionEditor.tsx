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
import { countWordsInMarkdown } from "@/utils/markdown";
import MarkdownEditor from "./MarkdownEditor";
import { useAuthStore } from "@/store/Auth";
import { useMutation } from "@tanstack/react-query";
import { useDb } from "@/hooks/usedb";

const QuestionEditor = () => {
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  const questionSchema = z.object({
    title: z.string().min(1, { message: "Required" }),
    content: z.string().refine((v) => countWordsInMarkdown(v) > 50, {
      message: "Atleast 50 words are required.",
    }),
    tags: z
      .array(
        z.object({
          id: z.string(),
          text: z.string(),
        })
      )
      .min(1, { message: "Atleast add 1 tag." }),
    attachment: z.array(
      z.object({
        file: z.instanceof(File),
        preview: z.string(),
      })
    ),
  });

  const { createQuestion } = useDb();

  const form = useForm<z.infer<typeof questionSchema>>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
      attachment: undefined,
    },
  });

  const { user } = useAuthStore();

  const { mutate: addQuestion } = useMutation({
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
      file: File;
    }) => createQuestion(title, content, authorId, tags, file),
    mutationKey: ["addQuestion"],
    onSuccess: () => {
      console.log("success");
    },
    onError: (error) => {
      setError("root", {
        type: "custom",
        message: error.message,
      });
    },
  });

  const {
    control,
    register,
    setError,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;

  const onSubmit: SubmitHandler<z.infer<typeof questionSchema>> = (values) => {
    const file = values.attachment[0].file;
    const { title, content } = values;
    const tags = values.tags.map((tag) => tag.text);
    if (!user?.$id) return;
    const authorId = user?.$id;
    addQuestion({ title, content, authorId, tags, file });
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-col gap-5">
            <div className="">
              <span className="text-3xl font-semibold">Add Question</span>
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
                Add up to 5 tags (separated by comma's)
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
              <ShimmerButton>Submit</ShimmerButton>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default QuestionEditor;
