import CloudIcons from "@/components/CloudIcons";
import RecentQuestions from "@/components/RecentQuestions";
import { useDb } from "@/hooks/usedb";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function Home() {
  const queryClient = new QueryClient();
  const { getQuestions } = useDb();

  await queryClient.prefetchQuery({
    queryKey: ["lates-questions"],
    queryFn: () => getQuestions({ limit: 5 }),
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div className="px-5">
      <div className="py-10 flex items-center">
        <div className="flex-grow">
          <h2 className="text-5xl font-semibold">CodeOverflow</h2>
          <p className="text-lg">Welcome to Codeoverflow</p>
          <p className="text-lg">Your programming helper</p>
        </div>
        <CloudIcons />
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <RecentQuestions />
      </HydrationBoundary>
    </div>
  );
}
