"use client";

import { useDb } from "@/hooks/usedb";
import { useQuery } from "@tanstack/react-query";
import SearchBox from "./SearchBox";
import QuestionList from "./QuestionList";
import { useSearchParams } from "next/navigation";
import ShimmerButton from "./magicui/shimmer-button";
import Link from "next/link";
import QuestionsPagination from "./QuestionsPagination";

export default function Questions() {
  const { getQuestions } = useDb();
  const params = useSearchParams();
  const query = params.get("q") ?? undefined;

  const { data, isFetching } = useQuery({
    queryKey: ["questions", query],
    queryFn: () => getQuestions({ searchQuery: query }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex  items-end">
        <div className="flex-grow">
          <SearchBox />
        </div>
        <div className="flex-grow flex justify-end">
          <Link href="/questions/add">
            <ShimmerButton className="ml-2">Add Question</ShimmerButton>
          </Link>
        </div>
      </div>
      <div className="text-lg">{data?.total} questions found</div>
      <hr />
      {isFetching && <div className="">...Loading</div>}
      {data && data?.documents?.length ? (
        <QuestionList data={data?.documents} />
      ) : (
        ""
      )}
      <QuestionsPagination className="my-3" />
    </div>
  );
}
