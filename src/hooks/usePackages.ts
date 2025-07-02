import { cancelPackages, choosePackages, getCurrentPackages, getPackages } from "@/services/Packages";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useFetchPackages() {
  return useQuery({
    queryKey: ["packages"],
    queryFn: getPackages,
    staleTime: Infinity,
  });
}

export function useFetchCurrentPackages() {
  return useQuery({
    queryKey: ["CurrentPackages"],
    queryFn: getCurrentPackages,
    staleTime: Infinity,
  });
}


export const useMutateChoosePackages = () => {
  return useMutation({
    mutationFn: choosePackages,
  });
};
export const useMutateCancelPackages = () => {
  return useMutation({
    mutationFn: cancelPackages,
  });
};
