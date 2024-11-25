import { IQuestion } from "@/types/models";
import { slugify } from "@/utils/slugify";
import Link from "next/link";
import React from "react";
import { BeamCard } from "./magicui/beam-card";
import { timeAgo } from "@/utils/time-ago";
import Image from "next/image";

export default function QuestionCard({ question }: { question: IQuestion }) {
  return (
    <Link
      href={`/questions/${question.$id}/${slugify(question.title)}`}
      key={question.$id}
    >
      <BeamCard beamSize={120} wrapperClassName="w-full p-3">
        <div className="flex gap-2">
          <div className="flex flex-col text-sm">
            <span>{question.totalVotes} Votes</span>
            <span>{question.totalAnswers} Answers</span>
          </div>
          <div className="flex-1">
            <h3>{question.title}</h3>
            <div className="flex justify-between text-sm">
              <div className="flex gap-1">
                {question.tags.map((tag) => (
                  <span
                    key={tag}
                    className="italic bg-gray-300 py-0.5 px-2 rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-1">
                {/* profile pic */}
                <Image
                  height={50}
                  width={50}
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                  src={question.author?.avatar.toString()}
                  alt=""
                />
                <span>{question.author?.name}</span>
                <span>&nbsp;asked&nbsp;</span>
                <span>{timeAgo(question.$createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </BeamCard>
    </Link>
  );
}
