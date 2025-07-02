import { addAddress, deleteAddress, getAddress } from "@/services/Address";
import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

export function useFetchAddress(userId: string) {
  return useQuery({
    queryKey: ["Address", userId],
    queryFn: () => getAddress(userId),
  });
}

export const useMutateDeleteAddress = () => {
  return useMutation({
    mutationFn: deleteAddress,
  });
};
export const useMutateAddAddress = () => {
  return useMutation({
    mutationFn: addAddress,
  });
};
