"use client";
import React from "react";
import QuestionList from "@/components/QuestionList";
import { useDb } from "@/hooks/usedb";
import { useQuery } from "@tanstack/react-query";

export default function RecentQuestions() {
  const { getQuestions } = useDb();
  const { data, error, isFetched, isFetching } = useQuery({
    queryKey: ["lates-questions"],
    queryFn: () => getQuestions({ limit: 5 }),
    staleTime: 1000 * 60 * 5,
  });
  return (
    <div className="py-10">
      <div className="">
        <h3 className="text-3xl font-semibold mb-2">Recent questions</h3>
      </div>
      {isFetching && <p>Loading...</p>}
      {isFetched && data ? (
        <QuestionList data={data.documents} />
      ) : (
        <p>Error</p>
      )}
    </div>
  );
}
