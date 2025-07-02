import apiClient from "@/config/apiClient";
import addressEndpoints from "@/config/endpoints/addressEndpoints";

export const getAddress = async (userId: string) => {
  const response = await apiClient.get(
    `${addressEndpoints.address}/${userId}/addresses`
  );
  return response.data.payload;
};

export const deleteAddress = async (id: number) => {
  const response = await apiClient.delete(`${addressEndpoints.delete}/${id}`);
  return response.data;
};
export const addAddress = async (data: any) => {
  const response = await apiClient.post(`${addressEndpoints.add}`, data);
  return response.data;
};
