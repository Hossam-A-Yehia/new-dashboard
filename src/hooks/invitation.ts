import { useQuery } from '@tanstack/react-query';
import { getInvitationsAPI } from '@/services/Invitations';

export interface GetInvitationsParams {
  isEnabled?: boolean;
  [key: string]: any;
}

export function useFetchInvitations(params: GetInvitationsParams) {
  return useQuery({
    queryKey: ['invitations', ...Object.entries(params)],
    queryFn: () => {
      // Exclude isEnabled from params before passing to API
      const { isEnabled, ...filteredParams } = params;
      return getInvitationsAPI(filteredParams);
    },
    enabled: params.isEnabled,
  });
}


