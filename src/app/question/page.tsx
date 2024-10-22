import QuestionList from "@/components/QuestionList";
import TopContributers from "@/components/TopContributers";
import React from "react";

const page = () => {
  return (
    <div className="">
      <div className="px-5">
        <div className="">
          <h3 className="text-3xl font-semibold mb-2">Recent questions</h3>
        </div>
        <QuestionList />
      </div>
      <aside className="w-1/3">
        <TopContributers />
      </aside>
    </div>
  );
};

export default page;
