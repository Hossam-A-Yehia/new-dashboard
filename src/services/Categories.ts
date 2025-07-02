import apiClient from "@/config/apiClient";
import categoriesEndpoints from "@/config/endpoints/categoriesEndpoints";
import { Category } from "@/types/Categories";

export const getCategories = ({
  category_type,
}: {
  category_type?: number;
}) => {
  const queryParams: string[] = [];
  if (category_type) {
    queryParams.push(`filters[types][category_type][$eq]=${category_type}`);
  }

  const queryString = queryParams.join("&");

  return apiClient.get<null, { data: { payload: Category[] } }>(
    `${categoriesEndpoints.categories}?${queryString}`
  );
};
export const getUserCategories = (userId: number) => {
  return apiClient.get(
    `${categoriesEndpoints.usersCategories}/${userId}/categories`
  );
};

export const addUserCategory = async (data: {
  category_id: number;
  user_id: number;
}) => {
  const response = await apiClient.post(
    `${categoriesEndpoints.addUsersCategories}`,
    data
  );
  return response.data;
};
export const deleteUserCategory = async (categoryId: number) => {
  const response = await apiClient.delete(
    `${categoriesEndpoints.deleteUsersCategories}/${categoryId}`
  );
  return response.data;
};
export const Categories = async () => {
  const response = await apiClient.get(categoriesEndpoints.categories);
  return response.data;
};
