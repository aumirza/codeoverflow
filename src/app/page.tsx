import QuestionList from "@/components/QuestionList";

export default function Home() {
  return (
    <div className="px-5">
      <div className="">
        <h3 className="text-3xl font-semibold mb-2">Recent questions</h3>
      </div>
      <QuestionList />
    </div>
  );
}
