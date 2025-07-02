import apiClient from "@/config/apiClient";
import servicesEndpoints from "@/config/endpoints/servicesEndpoints";
import { CategoryService } from "@/types/Categories";

export const getServices = async (...params: any) => {
  const {
    id,
    type,
    subCategories,
    serviceProvidersTypes,
    page = 1,
    categoryId,
    categoryIds,
    paginate,
    businessTypes,
  } = params[0];

  const queryParams: string[] = [`page=${page}`];
  if (id) {
    queryParams.push(`filters[id][$eq]=${id}`);
  }
  if (categoryId) {
    queryParams.push(`filters[category_id][$eq]=${categoryId}`);
  }
  if (type) {
    queryParams.push(`filters[service_type][$eq]=${type}`);
  }
  if (subCategories && subCategories.length > 0) {
    subCategories.forEach((service: number, index: number) => {
      queryParams.push(`filters[category][id][$in][${index}]=${service}`);
    });
  }
  if (businessTypes && businessTypes.length > 0) {
    businessTypes.forEach((businessType: number, index: number) => {
      queryParams.push(`filters[category_id][$in][${index}]=${businessType}`);
    });
  }
  if (serviceProvidersTypes && serviceProvidersTypes.length > 0) {
    serviceProvidersTypes.forEach(
      (serviceProvidersType: number, index: number) => {
        queryParams.push(
          `filters[category][parent][id][$in][${index}]=${serviceProvidersType}`
        );
      }
    );
  }
  if (categoryIds) {
    categoryIds.forEach((categoryId: number, index: number) => {
      queryParams.push(`filters[category_id][$in][${index}]=${categoryId}`);
    });
  }
  const queryString = queryParams.join("&");
  const response = await apiClient.get(
    `${servicesEndpoints.services}?${queryString}`,
    {
      headers: {
        paginate: paginate ? 1 : null,
        paginationItems: "9",
      },
    }
  );
  return response.data;
};

export const getAttributes = async (...params: any) => {
  const { serviceId } = params[0];
  const response = await apiClient.get<null, { data: CategoryService[] }>(
    `${servicesEndpoints.attributes}/service/${serviceId}`
  );
  return response.data;
};

export const getCategoriesServicesAPI = async (categoryId: number[]) => {
  const response = await apiClient.get(
    `${servicesEndpoints.services}?filters[category_id][$eq]=${categoryId}`
  );
  return response.data;
};

export const addUserService = async (data: {
  services: { service_id: number; user_id: number }[];
}) => {
  const response = await apiClient.post(
    `${servicesEndpoints.addUserServices}`,
    data
  );
  return response.data;
};

export const deleteUserService = async (serviceId: number) => {
  const response = await apiClient.delete(
    `${servicesEndpoints.deleteUserServices}/${serviceId}`
  );
  return response.data;
};
