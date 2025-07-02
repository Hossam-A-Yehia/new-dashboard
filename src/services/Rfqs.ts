import apiClient from "@/config/apiClient";
import rfqEndpoints from "@/config/endpoints/rfqsEndpoints";
import { StructuredUserForAsk } from "@/types/Ask";
import { GetQuotationsParams, GetRfpBusinessUsersParams } from "@/types/RFQs";

interface GetRfqsParams {
  id?:number | string;
  page?: number;
  title?: string;
  userId?: number;
  username?: string;
  description?: string;
  projectId?: number;
  category?: string;
  service?: string;
}
const headers = {
  "Content-Type": "multipart/form-data",
};


export const mutateAddRFP = async (data: { files: any }) => {
  const response = await apiClient.post(`${rfqEndpoints.rfq}`, data, {
    headers,
  });
  return response.data;
};
export const mutateAddAsk = async (data: StructuredUserForAsk) => {
  const response = await apiClient.post(`${rfqEndpoints.rfq}`, data, {
    headers,
  });
  return response.data;
};


export const getRfqsAPI = (params: GetRfqsParams) => {
  const {
    id,
    page = 1,
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
  return apiClient.get(`${rfqEndpoints.rfq}?${queryString}`, { headers: { paginate: true } });
};


export const getRfpBusinessUsersAPI = async (
  params: GetRfpBusinessUsersParams
) => {
  const {
    volumOfWork,
    yearsOfExperience,
    serviceId,
    priceRanges,
    classifications,
    city,
    cityId,
    page,
  } = params;

  const buildQueryParams = (filterKey: string, values: number[]) =>
    values
      .map((value, index) => `filters[${filterKey}][$in][${index}]=${value}`)
      .join("&");

  const queryParts: string[] = [];

  if (page) {
    queryParts.push(`page=${page}`);
  }
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
  const baseUrl = `${rfqEndpoints.businessUsers}`;

  if (cityId) {
    return apiClient.get(
      `${baseUrl}?service_id=${serviceId}&city_id=${cityId}&${queryString}`
    );
  }
  if (serviceId && city) {
    return apiClient.get(
      `${baseUrl}?service_id=${serviceId}&city_id=${city}&${queryString}`
    );
  }
  return apiClient.get(`${baseUrl}?${queryString}`);
};

export const getQuotations = async ({
  discussionable_id,
  user_id,
  discussionable_type,
}: GetQuotationsParams) => {
  const response = await apiClient.get(
    `${rfqEndpoints.getQuotations}?discussionable_type=${discussionable_type}&discussionable_id=${discussionable_id}&user_id=${user_id}`
  );
  return response?.data.payload;
};

export const getMyInvitations = async (id: string) => {
  const queryParams: string[] = [];
  if (id) {
    queryParams.push(`filters[id][$eq]=${id}`);
  }
  const response = await apiClient.get(
    `${rfqEndpoints.invitations}?invitation_type=1`
  );
  return response?.data.payload;
};

export const mutateAcceptQuotation = async ({
  user_id,
  rfp_id,
}: {
  user_id: number;
  rfp_id: number;
}) => {
  const response = await apiClient.put(
    `${rfqEndpoints.rfq}/${rfp_id}/complete/${user_id}`
  );
  return response.data;
};
export const mutateDeclineQuotation = async ({
  user_id,
  rfp_id,
}: {
  user_id: number;
  rfp_id: number;
}) => {
  const response = await apiClient.put(
    `${rfqEndpoints.rfq}/${rfp_id}/decline/${user_id}`
  );
  return response.data;
};


export const addReply = async (data: any) => {
  const response = await apiClient.post(`${rfqEndpoints.addReply}`, data, {
    headers,
  });
  return response.data;
};
