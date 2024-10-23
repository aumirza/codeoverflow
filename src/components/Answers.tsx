import { Models } from "appwrite";
import { useState } from "react";
import { IAnswer } from "@/types/models";
import AnswerForm from "./AnswerForm";
import AnswersList from "./AnswersList";

function Answers({
  data,
  questionId,
}: {
  data: Models.DocumentList<IAnswer>;
  questionId: string;
}) {
  const [answers, setAnswers] = useState<IAnswer[]>(data.documents);
  const handleAddAnswer = (answer: IAnswer) => {
    setAnswers([...answers, answer]);
  };
  return (
    <div>
      <h4 className="text-2xl my-2 mt-5">{data.total ?? "No"} Answers</h4>
      <hr />
      <AnswersList answers={answers} />
      <hr />
      <AnswerForm questionId={questionId} onAddAnswer={handleAddAnswer} />
    </div>
  );
}

export default Answers;
