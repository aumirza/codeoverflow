import { IQuestion } from "@/types/models";
import QuestionCard from "./QuestionCard";

const QuestionList = ({ data }: { data: IQuestion[] }) => {
  return (
    <div className="w-full flex flex-col gap-2">
      {data.map((question) => (
        <QuestionCard key={question.$id} question={question} />
      ))}
    </div>
  );
};

export default QuestionList;
