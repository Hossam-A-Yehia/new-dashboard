import {
  getAskBusinessUsersAPI,
  getMyAsks,
  getReceivedAsks,
  mutateAddAsk,
} from "@/services/Asks";
import { GetAskBusinessUsersParams } from "@/types/Ask";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useFetchAskBusinessUsers(params: GetAskBusinessUsersParams) {
  return useQuery({
    queryKey: ["askBusinessUsers", params],
    queryFn: () => getAskBusinessUsersAPI(params),
    enabled: true,
  });
}

export function useMutateAddAsk() {
  return useMutation({
    mutationFn: mutateAddAsk,
  });
}

export function useFetchMyAsks(id: string | null, isInvitation: boolean) {
  return useQuery({
    queryKey: ["RFQs"],
    queryFn: () => getMyAsks(id || ""),
    enabled: isInvitation,
  });
}

export function useFetchReceivedAsks(id: string | null, isInvitation: boolean) {
  return useQuery({
    queryKey: ["invitations"],
    queryFn: () => getReceivedAsks(id || ""),
    enabled: isInvitation,
  });
}
