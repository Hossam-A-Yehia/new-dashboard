import apiClient from "@/config/apiClient";
import rfqEndpoints from "@/config/endpoints/rfqsEndpoints";
import { GetQuotationsParams } from "@/types/RFQs";

interface GetAskParams {
  id?: number | string;
  page?: number;
  category?: string;
  service?: string;
}

export const getAskPI = (params: GetAskParams) => {
  const {
    page = 1,
    id,
    service,
    category,
  } = params;

  const queryParams = [`page=${page}`];

  if (id !== undefined) {
    queryParams.push(`filters[id][$eq]=${id}`);
  }

  if (service !== undefined) {
    queryParams.push(
      `filters[$or][0][service][name_ar][$contains]=${service}&filters[$or][1][service][name_en][$contains]=${service}`,
    );
  }

  if (category !== undefined) {
    queryParams.push(
      `filters[service][category][name_en][$contains]=${category}`
    );
  }
  const queryString = queryParams.join("&");
  return apiClient.get(`${rfqEndpoints.asks}?${queryString}`, { headers: { paginate: true } });
};


export const getReplies = async ({
  discussionable_id,
  user_id,
}: GetQuotationsParams) => {
  const response = await apiClient.get(
    `${rfqEndpoints.getQuotations}?discussionable_type=2&discussionable_id=${discussionable_id}&user_id=${user_id}`
  );
  return response?.data.payload;
};
