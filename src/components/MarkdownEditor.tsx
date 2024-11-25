import React, { useEffect, useState } from "react";
import { BeamCard } from "./magicui/beam-card";
import MDEditor from "@uiw/react-md-editor";
import { FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { countWordsInMarkdown } from "@/utils/markdown";
import { NUMBER_OF_WORDS } from "@/Constants";
import { Control } from "react-hook-form";
import { questionSchema } from "@/schemas/questionSchema";
import { z } from "zod";

function MarkdownEditor({
  control,
}: {
  control: Control<z.infer<typeof questionSchema>>;
}) {
  const [words, setWords] = useState(0);

  const handleCountWords = (v: string | undefined) => {
    if (!v) return setWords(0);
    const wordCount = countWordsInMarkdown(v);
    setWords(wordCount);
  };

  useEffect(() => {
    handleCountWords(control._defaultValues.content);
  }, []);

  return (
    <BeamCard duration={16}>
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span>Content</span>
          <span className="text-xs text-gray-600">
            Explain your problem in more detail.
          </span>
          <span className="text-xs text-gray-600">
            Describe it in atleast {NUMBER_OF_WORDS} words.
          </span>
        </div>
        <div className="">
          <div className="flex justify-center items-center h-14 w-14 rounded-full border-2">
            {words}
          </div>
        </div>
      </div>

      <FormField
        control={control}
        name="content"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <MDEditor
                className="mt-2"
                value={field.value}
                onChange={(v) => {
                  handleCountWords(v);
                  field.onChange(v);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </BeamCard>
  );
}

export default MarkdownEditor;
