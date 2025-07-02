import { addBranch, deleteBranch, getBranches } from "@/services/Branches";
import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

export function useFetchBranches(userId: string) {
  return useQuery({
    queryKey: ["branches"],
    queryFn: () => getBranches(userId),
  });
}

export const useMutateDeleteBranch = () => {
  return useMutation({
    mutationFn: deleteBranch,
  });
};
export const useMutateAddBranch = () => {
  return useMutation({
    mutationFn: addBranch,
  });
};
