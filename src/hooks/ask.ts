import { useQuery } from '@tanstack/react-query';
import { getAskPI, getReplies } from '@/services/ask';
import { GetQuotationsParams } from '@/types/RFQs';

export interface GetASKsParams {
  isEnabled?: boolean;
  [key: string]: any;
}

export function useFetchAsks(params: GetASKsParams) {
  return useQuery({
    queryKey: ['asks', ...Object.entries(params)],
    queryFn: () => {
      // Exclude isEnabled from params before passing to API
      const { isEnabled, ...filteredParams } = params;
      return getAskPI(filteredParams);
    },
    enabled: params.isEnabled,
  });
}



export function useFetchReplies(params: GetQuotationsParams) {
  return useQuery({
    queryKey: ["Replies", params],
    queryFn: () => getReplies(params),
  });
}
