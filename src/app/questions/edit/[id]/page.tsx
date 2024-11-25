import QuestionEditor from "@/components/QuestionEditor";
import { useDb } from "@/hooks/usedb";
import React from "react";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { getQuestion } = useDb();
  const id = (await params).id;

  const question = await getQuestion(id);

  return (
    <div>
      <QuestionEditor question={question} />
    </div>
  );
};

export default Page;
