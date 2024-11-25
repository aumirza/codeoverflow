import QuestionPage from "@/components/Question";
import { useDb } from "@/hooks/usedb";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function QuestionRoute(props: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const params = await props.params;
  const id = params.id;
  const { getQuestionIncluded } = useDb();

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["question", id],
    queryFn: () => getQuestionIncluded(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <QuestionPage questionId={id} />
    </HydrationBoundary>
  );
}
