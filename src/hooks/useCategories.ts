import {
  addUserCategory,
  Categories,
  deleteUserCategory,
  getCategories,
  getUserCategories,
} from "@/services/Categories";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useFetchCategories(...params: [Record<string, any>]) {
  return useQuery({
    queryKey: ["Categories", ...params],
    queryFn: () => getCategories(...params),
  });
}

export function useFetchUserCategories(userId: number) {
  return useQuery({
    queryKey: ["userCategories", userId],
    queryFn: () => getUserCategories(userId),
    enabled: Boolean(userId),
  });
}

export function useMutateAddUserCategory() {
  return useMutation({
    mutationFn: addUserCategory,
  });
}

export function useMutateDeleteUserCategory() {
  return useMutation({
    mutationFn: deleteUserCategory,
  });
}

export function useFetchCategoriesRFQ() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: Categories,
  });
}
