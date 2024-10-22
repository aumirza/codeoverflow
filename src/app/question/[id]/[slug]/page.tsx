"use client";
import { useDb } from "@/hooks/usedb";
import { timeAgo } from "@/utils/time-ago";
import { useQuery } from "@tanstack/react-query";
import MDEditor from "@uiw/react-md-editor";
import React, { useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

function Page({ params }: { params: { id: string; slug: string } }) {
  const id = params.id;
  const { getQuestion } = useDb();
  const { data, error } = useQuery({
    queryKey: ["question", id],
    queryFn: () => getQuestion(id),
  });
  useEffect(() => {
    console.log("data", data);
  }, [data]);
  if (error) return <div>Failed to load</div>;
  return (
    <div>
      <div className="">
        <h2 className="text-4xl">{data?.title}</h2>
        <div className="flex gap-5">
          <span>asked {timeAgo(data?.$createdAt ?? "")}</span>
          <span>Answers{data?.answers.total}</span>
          <span>Votes {data?.votes.total}</span>
        </div>
      </div>
      <hr />
      <div className="flex gap-5 mt-5">
        <div className="">
          <div className="flex justify-center items-center size-8  rounded-full bg-gray-400">
            <FaChevronUp />
          </div>
          <div className="flex justify-center">{data?.votes.total}</div>
          <div className="flex justify-center items-center size-8 rounded-full bg-gray-400">
            <FaChevronDown />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <MDEditor.Markdown className="p-5" source={data?.content} />
          <div className="">
            {data?.attachment ? (
              <img src={data?.attachment.toString()} alt="" />
            ) : (
              ""
            )}
          </div>
          <div className="flex gap-3">
            {data?.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
