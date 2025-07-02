import { useQuery } from "@tanstack/react-query";
import {
  addServiceRequest,
  deleteServiceRequest,
  editServiceRequest,
  editUserServiceRequest,
  getServiceRequest,
  getUserServiceRequests,
} from "../services/SuggestServices.ts";
import { useMutation } from "@tanstack/react-query";

export function useFetchServiceRequest() {
  return useQuery({
    queryKey: ["UserSuggestions"],
    queryFn: () => getServiceRequest(),
  });
}

export function useEditServiceRequest() {
  return useMutation({
    mutationFn: editServiceRequest,
  });
}

export function useDeleteServiceRequest() {
  return useMutation({
    mutationFn: deleteServiceRequest,
  });
}
export function useEditUserServiceRequest() {
  return useMutation({
    mutationFn: editUserServiceRequest,
  });
}

export function useMutateServiceRequest() {
  return useMutation({
    mutationFn: addServiceRequest,
  });
}

export function useFetchUserServiceRequests({ userId, pageIndex }: { userId: string; pageIndex: number }) {
  return useQuery({
    queryKey: ["UserSuggestions", userId],
    queryFn: () => getUserServiceRequests(userId, pageIndex),
    enabled: Boolean(userId),
  });
}
