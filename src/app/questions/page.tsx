import Questions from "@/components/Questions";
import { useDb } from "@/hooks/usedb";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function QuestionsRoute(
  props: {
    searchParams: Promise<{ q: string; page: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const { getQuestions } = useDb();
  const queyClient = new QueryClient();
  await queyClient.prefetchQuery({
    queryKey: ["questions", searchParams.q],
    queryFn: () =>
      getQuestions({
        searchQuery: searchParams.q,
      }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <div className="">
      <div className="px-5">
        <div className="">
          <h3 className="text-3xl font-semibold mb-2">All questions</h3>
        </div>
        <HydrationBoundary state={dehydrate(queyClient)}>
          <Questions />
        </HydrationBoundary>
      </div>
    </div>
  );
}
