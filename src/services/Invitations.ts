import apiClient from "@/config/apiClient";
import rfqEndpoints from "@/config/endpoints/rfqsEndpoints";

interface GetInvitationsParams {
  id?: number | string;
  page?: number;
  category?: string;
  service?: string;
}

export const getInvitationsAPI = (params: GetInvitationsParams) => {
  const {
    page = 1,
    id,
  } = params;

  const queryParams = [`page=${page}`];

  if (id !== undefined) {
    queryParams.push(`filters[invitable_id][$eq]=${id}`);
  }
  const queryString = queryParams.join("&");
  return apiClient.get(`${rfqEndpoints.invitations}?invitation_type=1&${queryString}`, { headers: { paginate: true } });
};
