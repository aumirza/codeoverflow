import { IAnswer } from "@/types/models";
import React from "react";
import Content from "./Content";

function AnswersList({ answers }: { answers: IAnswer[] }) {
  return (
    <div className="w-full">
      {answers.map((answer) => (
        <Content type="answer" key={answer.$id} data={answer} />
      ))}
    </div>
  );
}

export default AnswersList;
