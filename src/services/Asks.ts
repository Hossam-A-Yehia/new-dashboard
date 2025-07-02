import apiClient from "@/config/apiClient";
import rfqEndpoints from "@/config/endpoints/rfqsEndpoints";
import { GetAskBusinessUsersParams } from "@/types/Ask";

export const getAskBusinessUsersAPI = async (
  params: GetAskBusinessUsersParams
) => {
  const {
    serviceId,
    priceRanges,
    volumOfWork,
    yearsOfExperience,
    classifications,
  } = params;

  const buildQueryParams = (filterKey: string, values: number[]) =>
    values
      .map((value, index) => `filters[${filterKey}][$in][${index}]=${value}`)
      .join("&");

  const queryParts: string[] = [];
  if (yearsOfExperience?.length) {
    queryParts.push(buildQueryParams("years_of_experience", yearsOfExperience));
  }
  if (volumOfWork?.length) {
    queryParts.push(buildQueryParams("volume_of_work", volumOfWork));
  }
  if (priceRanges?.length) {
    queryParts.push(buildQueryParams("price_range", priceRanges));
  }
  if (classifications?.length) {
    queryParts.push(
      buildQueryParams(
        "classifications][business_user_classifications.classification",
        classifications
      )
    );
  }

  const queryString = queryParts.join("&");

  if (serviceId) {
    return apiClient.get(
      `${rfqEndpoints.getServices}/${serviceId}/business-user?${queryString}`
    );
  }
  return apiClient.get(`${rfqEndpoints.getServices}?${queryString}`);
};

export const mutateAddAsk = async (data: { files: any }) => {
  const headers = {
    "Content-Type": "multipart/form-data",
  };
  const response = await apiClient.post(`${rfqEndpoints.asks}`, data, {
    headers,
  });
  return response.data;
};

export const getMyAsks = async (id: string) => {
  const queryParams: string[] = [];
  if (id) {
    queryParams.push(`filters[id][$eq]=${id}`);
  }
  const response = await apiClient.get(`${rfqEndpoints.asks}?${queryParams}`);
  return response?.data.payload;
};

export const getReceivedAsks = async (id: string) => {
  const queryParams: string[] = [];
  if (id) {
    queryParams.push(`filters[id][$eq]=${id}`);
  }
  const response = await apiClient.get(
    `${rfqEndpoints.invitations}?invitation_type=2`
  );
  return response?.data.payload;
};
