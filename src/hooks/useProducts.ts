import { getProductsAPI, mutateAddBulkProduct, mutateAddProduct, mutateDeleteProduct, mutateDownloadTemplate, mutateEditProduct } from "@/services/Products";
import { useMutation, useQuery } from "@tanstack/react-query";


export function useFetchProducts( params: any[] = []) {
  return useQuery({
    queryKey: ["products", ...params],
    queryFn: () => getProductsAPI(...(params as [any])),
  });
}

export function useMutateAddProduct() {
  return useMutation({
    mutationFn: mutateAddProduct,
  });
}

export function useMutateAddBulkProduct() {
  return useMutation({
    mutationFn: mutateAddBulkProduct,
  });
}

export function useMutateEditProduct() {
  return useMutation({
    mutationFn: mutateEditProduct,
  });
}

export function useMutateDeleteProduct() {
  return useMutation({
    mutationFn: mutateDeleteProduct,
  });
}

export function useMutateDownloadTemplate() {
    return useMutation({
        mutationFn: mutateDownloadTemplate,
    });
}
