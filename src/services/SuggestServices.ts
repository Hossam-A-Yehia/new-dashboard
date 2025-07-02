import apiClient from '@/config/apiClient';
import SuggestServiceEndpoint from '@/config/endpoints/SuggestServiceEndpoint';

export const getServiceRequest = () => {
  return apiClient.get(`${SuggestServiceEndpoint.SuggestService}`, {
    headers: {
      Paginate: 50,
    },
  });
};

export const editServiceRequest = ({ status, Id }: { status: any; Id: string }) =>
  apiClient.put(SuggestServiceEndpoint.SuggestService + `/${Id}/status`, status);

export const deleteServiceRequest = (rowId: string) =>
  apiClient.delete(SuggestServiceEndpoint.SuggestService + '/' + rowId);

export const addServiceRequest = (userData: any) =>
  apiClient.post(`${SuggestServiceEndpoint.SuggestService}`, userData);

export const editUserServiceRequest = ({
  userData,
  suggestionId,
}: {
  userData: any;
  suggestionId: string;
}) => apiClient.put(SuggestServiceEndpoint.SuggestService + '/' + suggestionId, userData);

export const getUserServiceRequests = (userId: any, pageIndex: any) =>
  apiClient.get(
    `${SuggestServiceEndpoint.SuggestService}?page=${pageIndex}&filters[user_id][$eq]=${userId}`,
    {
      headers: { Paginate: 10 },
    },
  );
