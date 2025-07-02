import apiClient from "@/config/apiClient";
import rfqEndpoints from "@/config/endpoints/rfqsEndpoints";

interface GetRecievedAsksParams {
  id?: number | string;
  page?: number;
  category?: string;
  service?: string;
}

export const getRecievedAsksAPI = (params: GetRecievedAsksParams) => {
  const {
    page = 1,
    id,
  } = params;

  const queryParams = [`page=${page}`];

  if (id !== undefined) {
    queryParams.push(`filters[invitable_id][$eq]=${id}`);
  }
  const queryString = queryParams.join("&");
  return apiClient.get(`${rfqEndpoints.invitations}?invitation_type=2&${queryString}`, { headers: { paginate: true } });
};
