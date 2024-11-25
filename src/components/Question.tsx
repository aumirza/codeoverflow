"use client";

import Answers from "@/components/Answers";
import Content from "@/components/Content";
import { useDb } from "@/hooks/usedb";
import { useAuthStore } from "@/store/Auth";
import { timeAgo } from "@/utils/time-ago";
import { useQuery } from "@tanstack/react-query";
import { EditIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";

export default function QuestionPage({ questionId }: { questionId: string }) {
  const { user } = useAuthStore();
  const { getQuestionIncluded } = useDb();
  const { data, error, isFetching } = useQuery({
    queryKey: ["question", questionId],
    queryFn: () => getQuestionIncluded(questionId),
    staleTime: Infinity,
  });

  if (isFetching) return <div>Loading...</div>;
  if (error || !data) return <div>Failed to load</div>;

  return (
    <div>
      <div className="">
        <h2 className="text-3xl font-semibold">{data?.title}</h2>
        <div className="flex justify-between">
          <div className="flex gap-4 text-sm">
            <span>Asked {timeAgo(data?.$createdAt ?? "")}</span>
            <span>Answers {data?.answers.total}</span>
            <span>Votes {data?.votes.total}</span>
          </div>
          <div className="flex gap-2">
            {user?.$id === data?.authorId && (
              <>
                <Link href={`/questions/edit/${data.$id}`}>
                  <EditIcon />
                </Link>
                <div className="cursor-pointer">
                  <Trash2Icon />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <hr />
      <Content type="question" data={data} />
      <Answers questionId={data.$id} data={data.answers} />
    </div>
  );
}
