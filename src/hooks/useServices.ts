import {
  addUserService,
  deleteUserService,
  getAttributes,
  getCategoriesServicesAPI,
  getServices,
} from "@/services/Services";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useFetchServices(...params: any) {
  return useQuery({
    queryKey: ["Services", ...params],
    queryFn: () => getServices(...params),
  });
}
export function useFetchAttributes(...params: any) {
  return useQuery({
    queryKey: ["Attributes", ...params],
    queryFn: () => getAttributes(...params),
  });
}

export function useFetchCategoriesServices(categoryId: number[]) {
  return useQuery({
    queryKey: ["categoriesServices", categoryId],
    queryFn: () => getCategoriesServicesAPI(categoryId),
  });
}

export function useMutateAddUserService() {
  return useMutation({
    mutationFn: addUserService,
  });
}

export function useMutateDeleteUserService() {
  return useMutation({
    mutationFn: deleteUserService,
  });
}
