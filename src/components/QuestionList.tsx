"use client";

import { useDb } from "@/hooks/usedb";
import { timeAgo } from "@/utils/time-ago";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { BeamCard } from "./magicui/beam-card";
import Link from "next/link";
import { slugify } from "@/utils/slugify";

const QuestionList = () => {
  const { getQuestions } = useDb();

  const { data, isFetching } = useQuery({
    queryKey: ["questions"],
    queryFn: getQuestions,
    staleTime: Infinity,
  });

  if (isFetching) return <div>Loading...</div>;

  return (
    <div className="w-full flex flex-col gap-2">
      {data &&
        data.documents.map((question) => (
          <Link
            href={`/question/${question.$id}/${slugify(question.title)}`}
            key={question.$id}
          >
            <BeamCard wrapperClassName="w-full p-3">
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
                        <span className="italic bg-gray-300 py-0.5 px-2 rounded-md">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="">
                      {/* profile pic */}
                      <img
                        className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                        src={question.author?.avatar.toString()}
                        alt=""
                      />
                      <span>{question.author?.name}</span>
                      <span>&nbsp; asked &nbsp;</span>
                      <span>{timeAgo(question.$createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </BeamCard>
          </Link>
        ))}
    </div>
  );
};

export default QuestionList;
