import { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuthStore } from "@/store/Auth";
import { useDb } from "@/hooks/usedb";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function VoteButtons({
  totalVotes,
  onType,
  typeId,
}: {
  totalVotes: number;
  onType: "question" | "answer";
  typeId: string;
}) {
  const [voteCount, setVoteCount] = useState<number>(totalVotes);

  const { createOrUpdateVote, isVotedByOnType } = useDb();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: voteStatus, isSuccess } = useQuery({
    queryKey: ["votesOn", onType, typeId],
    queryFn: () => isVotedByOnType(onType, typeId, user!.$id),
    enabled: !!user,
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["voteOn", onType, typeId],
    mutationFn: async (voteType: "up" | "down") => {
      return await createOrUpdateVote(voteType, onType, typeId, user!.$id);
    },
    onMutate: async (voteType) => {
      queryClient.cancelQueries({ queryKey: ["votesOn", onType, typeId] });
      const previousVoteStatus = queryClient.getQueryData([
        "votesOn",
        onType,
        typeId,
      ]);
      const previousVoteCount = voteCount;

      const isUpvote = voteType === "up";
      const isCancelVote =
        (isUpvote && voteStatus!.isUpvote) ||
        (!isUpvote && voteStatus!.isDownvote);
      const isSwitchVote =
        (isUpvote && voteStatus!.isDownvote) ||
        (!isUpvote && voteStatus!.isUpvote);
      let newVoteStatus = {};

      if (isCancelVote) {
        newVoteStatus = { isUpvote: false, isDownvote: false };
        setVoteCount(voteCount + (isUpvote ? -1 : 1));
      } else if (isSwitchVote) {
        newVoteStatus = {
          isUpvote,
          isDownvote: !isUpvote,
        };
        setVoteCount(voteCount + (isUpvote ? 2 : -2));
      } else {
        newVoteStatus = {
          isUpvote,
          isDownvote: !isUpvote,
        };
        setVoteCount(voteCount + (isUpvote ? 1 : -1));
      }
      queryClient.setQueryData(["votesOn", onType, typeId], () => {
        return newVoteStatus;
      });
      return { previousVoteStatus, previousVoteCount };
    },
    onSuccess: ({ data }) => {
      setVoteCount(Number(data.netCount));
      toast.success("Thanks for your feedback");
    },
    onError: (error, _, context) => {
      toast.error("Vote failed to register, Try again");
      console.error("Failed to register vote on the server:", error);
      queryClient.setQueryData(
        ["votesOn", onType, typeId],
        context?.previousVoteStatus
      );
      setVoteCount(context?.previousVoteCount!);
    },
  });

  const handleVoteChange = (voteType: "up" | "down") => {
    if (!user) {
      return alert("Please login to vote");
      // throw new Error("User not logged in");
    }
    if (!voteStatus) return;
    mutate(voteType);
  };

  useEffect(() => {
    voteStatus;
  }, [voteStatus]);

  return (
    <div className="">
      {/* TODO(Fix): Button are hovering even on disabled state */}
      <button
        className={cn(
          "flex justify-center items-center size-10  rounded-full border-2  hover:bg-gray-400",
          isSuccess && voteStatus.isUpvote ? "bg-gray-400" : ""
        )}
        disabled={isPending}
        onClick={() => handleVoteChange("up")}
      >
        <FaChevronUp />
      </button>
      <div className="flex justify-center my-2">{voteCount}</div>
      <button
        className={cn(
          "flex justify-center items-center size-10  rounded-full border-2  hover:bg-gray-400",
          isSuccess && voteStatus.isDownvote ? "bg-gray-400" : ""
        )}
        disabled={isPending}
        onClick={() => handleVoteChange("down")}
      >
        <FaChevronDown />
      </button>
    </div>
  );
}

export default VoteButtons;
