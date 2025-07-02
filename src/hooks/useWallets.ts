import { useQuery } from '@tanstack/react-query';
import { getWalletsAPI } from '@/services/Wallets';

export interface GetWalletsParams {
  isEnabled?: boolean;
  [key: string]: any;
}

export function useFetchWallets(params: GetWalletsParams) {
  return useQuery({
    queryKey: ['wallets', ...Object.entries(params)],
    queryFn: () => {
      // Exclude isEnabled from params before passing to API
      const { isEnabled, ...filteredParams } = params;
      return getWalletsAPI(filteredParams);
    },
    enabled: params.isEnabled,
  });
}


