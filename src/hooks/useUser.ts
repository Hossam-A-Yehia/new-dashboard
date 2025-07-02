import {
  getBasicUsersAPI,
  getBusinessUsers,
  getUserServicesAPI,
  mutateEditBusinessUser,
  mutateForceDeleteBasicUser,
  mutateTechnicalUser,
  userServices,
} from '@/services/User';
import { GetBusinessUsersAPIParams } from '@/types/Services';
import {  useMutation, useQuery } from '@tanstack/react-query';

export function useMutateTechnicalUser() {
  return useMutation({
    mutationFn: mutateTechnicalUser,
  });
}

export function useFetchBusinessUsers(...params: [GetBusinessUsersAPIParams]) {
  return useQuery({
    queryKey: ['businessUsers', ...params],
    queryFn: () => getBusinessUsers(...params),
    staleTime: 5000,
  });
}

export function useMutateEditBusinessUser() {
  return useMutation({
    mutationFn: mutateEditBusinessUser,
  });
}

export function useMutateForceDeleteBasicUser() {
  return useMutation({
    mutationFn: mutateForceDeleteBasicUser,
  });
}

export function useFetchUserServices(userId: string) {
  return useQuery({
    queryKey: ['user-services', +userId],
    queryFn: () => userServices(userId),
    enabled: Boolean(userId),
  });
}

export function useFetchBasicUsers(...params: [any]) {
  return useQuery({
    queryKey: ["basicUsers", params],
    queryFn: () => getBasicUsersAPI(...params),
    enabled: params.length ? !!params[0]?.isEnabled : true,
  });
}

export function useFetchUserServicesForIdea({ userId, serviceId }: { userId: string; serviceId?: string }) {
  const params: { userId: any; serviceId?: any } = { userId };
  if (serviceId) {
    params.serviceId = serviceId;
  }
  return useQuery({
    queryKey: ["userServices", params],
    queryFn: () => getUserServicesAPI({ userId: userId, serviceId }),
    enabled: Boolean(userId),
  });
}
