import {useMutation, useQuery} from "@tanstack/react-query";

import {getImagesAPI, mutateAddImage, mutateAddMultiImages, mutateDeleteImage, mutateEditImage,} from "../services/images";

export function useFetchImages({ params }:any) {
  return useQuery({
    queryKey: ["images", params],
    queryFn: () => getImagesAPI({params}),
  });
}

export function useMutateAddImage() {
  return useMutation({
    mutationFn: mutateAddImage,
  });
}

export function useMutateAddMultiImages() {
  return useMutation({
    mutationFn: mutateAddMultiImages,
  });
}

export function useMutateEditImage() {
  return useMutation({
    mutationFn: mutateEditImage,
  });
}

export function useMutateDeleteImage() {
  return useMutation({
    mutationFn: mutateDeleteImage,
  });
}
