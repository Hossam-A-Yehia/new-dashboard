import apiClient from "@/config/apiClient";
import branchesEndpoints from "@/config/endpoints/branchesEndpoints";

export const getBranches = async (userId: string) => {
  const response = await apiClient.get(
    `${branchesEndpoints.branches}/${userId}/branches`
  );
  return response.data.payload;
};

export const deleteBranch = async (id: number) => {
  const response = await apiClient.delete(`${branchesEndpoints.delete}/${id}`);
  return response.data;
};
export const addBranch = async (data: any) => {
  const response = await apiClient.post(`${branchesEndpoints.add}`, data);
  return response.data;
};
