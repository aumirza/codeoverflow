import QuestionPage from "@/components/Question";
import { useDb } from "@/hooks/usedb";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function QuestionRoute({
  params,
}: {
  params: { id: string; slug: string };
}) {
  const id = params.id;
  const { getQuestion } = useDb();
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["question", id],
    queryFn: () => getQuestion(id),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <QuestionPage questionId={id} />
    </HydrationBoundary>
  );
}
