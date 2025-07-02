import { getDiscussion, mutateAddMessage } from "@/services/Discussion";
import { DiscussionParams } from "@/types/Discussion";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useFetchDiscussion(params: DiscussionParams) {
  return useQuery({
    queryKey: ["Discussion", params],
    queryFn: () => getDiscussion(params),
  });
}

export function useMutateAddMessage() {
  return useMutation({
    mutationFn: mutateAddMessage,
  });
}
