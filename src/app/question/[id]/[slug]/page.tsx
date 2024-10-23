"use client";
import Answers from "@/components/Answers";
import Content from "@/components/Content";
import { useDb } from "@/hooks/usedb";
import { timeAgo } from "@/utils/time-ago";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";

function Page({ params }: { params: { id: string; slug: string } }) {
  const id = params.id;
  const { getQuestion } = useDb();
  const { data, error, isFetching } = useQuery({
    queryKey: ["question", id],
    queryFn: () => getQuestion(id),
    staleTime: Infinity,
  });

  if (isFetching) return <div>Loading...</div>;
  if (error || !data) return <div>Failed to load</div>;

  return (
    <div>
      <div className="">
        <h2 className="text-3xl font-semibold">{data?.title}</h2>
        <div className="flex gap-4 text-sm">
          <span>Asked {timeAgo(data?.$createdAt ?? "")}</span>
          <span>Answers {data?.answers.total}</span>
          <span>Votes {data?.votes.total}</span>
        </div>
      </div>
      <hr />
      <Content type="question" data={data} />
      <Answers questionId={data.$id} data={data.answers} />
    </div>
  );
}

export default Page;
