import { useMutation, useQuery } from '@tanstack/react-query';
import { addReply, getMyInvitations, getQuotations, getRfpBusinessUsersAPI, getRfqsAPI, mutateAcceptQuotation, mutateAddRFP, mutateDeclineQuotation } from '@/services/Rfqs';
import { GetQuotationsParams, GetRfpBusinessUsersParams } from '@/types/RFQs';

export interface GetRfqsParams {
  isEnabled?: boolean;
  [key: string]: any;
}

export function useFetchRfqs(params: GetRfqsParams ) {
  return useQuery({
    queryKey: ['rfqs', ...Object.entries(params)],
    queryFn: () => {
      // Exclude isEnabled from params before passing to API
      const { isEnabled, ...filteredParams } = params;
      return getRfqsAPI(filteredParams);
    },
    enabled: params.isEnabled,
  });
}


export function useMutateAddRFP() {
  return useMutation({
    mutationFn: mutateAddRFP,
  });
}


export function useFetchRfpBusinessUsers(params: GetRfpBusinessUsersParams) {
  return useQuery({
    queryKey: ["rfpBusinessUsers", params],
    queryFn: () => getRfpBusinessUsersAPI(params),
    enabled: true,
  });
}

export function useFetchQuotations(params: GetQuotationsParams) {
  return useQuery({
    queryKey: ["Quotations", params],
    queryFn: () => getQuotations(params),
  });
}
export function useFetchMyInvitations(
  id: string | null,
  isInvitation: boolean
) {
  return useQuery({
    queryKey: ["invitations"],
    queryFn: () => getMyInvitations(id || ""),
    enabled: isInvitation,
  });
}

export function useMutateAcceptQuotation() {
  return useMutation({
    mutationFn: mutateAcceptQuotation,
  });
}

export function useMutateDeclineQuotation() {
  return useMutation({
    mutationFn: mutateDeclineQuotation,
  });
}

export function useMutateAddReply() {
  return useMutation({
    mutationFn: addReply,
  });
}
