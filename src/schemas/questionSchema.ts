import { NUMBER_OF_WORDS } from "@/Constants";
import { countWordsInMarkdown } from "@/utils/markdown";
import { z } from "zod";

export const questionSchema = z.object({
  title: z.string().min(1, { message: "Required" }),
  content: z
    .string()
    .refine((v) => countWordsInMarkdown(v) >= NUMBER_OF_WORDS, {
      message: `Atleast ${NUMBER_OF_WORDS} words are required.`,
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
