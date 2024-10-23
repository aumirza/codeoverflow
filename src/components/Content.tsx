import React from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { LuBadge } from "react-icons/lu";
import MDEditor from "@uiw/react-md-editor";
import Comments from "@/components/Comments";
import { IAnswer, IQuestion } from "@/types/models";

function Content({
  data,
  type,
}: {
  data: IQuestion | IAnswer;
  type: "question" | "answer";
}) {
  return (
    <div className="w-full flex gap-5 mt-5">
      <div className="">
        <div className="flex justify-center items-center size-10  rounded-full border-2">
          <FaChevronUp />
        </div>
        <div className="flex justify-center my-2">{data?.votes.total}</div>
        <div className="flex justify-center items-center size-10 rounded-full  border-2">
          <FaChevronDown />
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <MDEditor.Markdown className="p-5 rounded-lg" source={data?.content} />
        {data?.attachment ? (
          <div className="">
            <img src={data?.attachment.toString()} alt="" />
          </div>
        ) : (
          ""
        )}
        <div className="flex justify-between">
          <div className="">
            {data.tags && data.tags.length > 0 && (
              <div className="flex gap-3">
                {data?.tags.map((tag: string) => (
                  <div
                    key={tag}
                    className="bg-gray-300 text-gray-800 px-2 py-0.5 rounded-md"
                  >
                    #{tag}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <img
              className="size-7 rounded-full"
              src={data.author.avatar}
              alt=""
            />
            <div className="flex items-center gap-1">
              <span>{data.author.name}</span>
              <div className="relative grid place-items-center">
                <LuBadge className="size-5" />
                <span className="absolute text-sm">
                  {data.author.prefs.reputation}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Comments data={data?.comments} onType={type} typeId={data?.$id} />
      </div>
    </div>
  );
}

export default Content;
