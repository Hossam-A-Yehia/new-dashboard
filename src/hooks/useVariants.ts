import { getVariantsAPI, mutateAddVariant, mutateDeleteVariant, mutateEditVariant } from "@/services/Variants";
import { useMutation, useQuery } from "@tanstack/react-query";


export function useFetchVariants({ params }: { params: any }) {
  return useQuery({
    queryKey: ["variants", params],
    queryFn: () => getVariantsAPI({ params }),
    staleTime: Infinity,
  });
}

export function useMutateAddVariant() {
  return useMutation({
    mutationFn: mutateAddVariant,
  });
}

export function useMutateEditVariant() {
  return useMutation({
    mutationFn: mutateEditVariant,
  });
}

export function useMutateDeleteVariant() {
  return useMutation({
    mutationFn: mutateDeleteVariant,
  });
}
