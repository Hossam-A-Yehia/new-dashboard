import { getRecievedAsksAPI } from '@/services/RecievedAsks';
import { useQuery } from '@tanstack/react-query';

export interface GetRecievedAsksParams {
  isEnabled?: boolean;
  [key: string]: any;
}

export function useFetchRecievedAsks(params: GetRecievedAsksParams) {
  return useQuery({
    queryKey: ['recievedasks', ...Object.entries(params)],
    queryFn: () => {
      // Exclude isEnabled from params before passing to API
      const { isEnabled, ...filteredParams } = params;
      return getRecievedAsksAPI(filteredParams);
    },
    enabled: params.isEnabled,
  });
}


