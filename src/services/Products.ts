import apiClient from "@/config/apiClient";
import productsEndpoints from "@/config/endpoints/productsEndpoints";

export const getProductsAPI = (params: any) => {
  const { page = 1, title, userId, username, productGroup, productId } = params;
  const queryParams = [`page=${page}`];
  if (title !== undefined && title.trim()) {
    queryParams.push(`filters[title_en][$contains]=${title}`);
  }
  if (userId !== undefined) {
    queryParams.push(`filters[user][users.id][$eq]=${userId}`);
  }
  if (username !== undefined) {
    queryParams.push(`filters[user][username][$contains]=${username}`);
  }

  if (productId !== undefined) {
    queryParams.push(`filters[id][$eq]=${productId}`);
  }
  if (productGroup !== undefined) {
    queryParams.push(
      `filters[$or][0][service][name_ar][$contains]=${productGroup}&filters[$or][1][service][name_en][$contains]=${productGroup}`
    );
  }
  const queryString = queryParams.join("&");
  return apiClient.get(`${productsEndpoints.products}?${queryString}`, {headers:{ paginate: true }});
};

export const mutateAddProduct = (data: any) =>
  apiClient.post(`${productsEndpoints.products}`, data, {headers:{"Content-Type": "multipart/form-data"}})
export const mutateAddBulkProduct = (data: any) =>
  apiClient.post(`${productsEndpoints.productsBulkInsert}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const mutateEditProduct = ({ data, id }: { data: any; id: string | number }) =>
  apiClient.put(productsEndpoints.products + "/" + id, data);

export const mutateDeleteProduct = (id: string) =>
  apiClient.delete(productsEndpoints.products + "/" + id);

export const mutateDownloadTemplate = (userServiceId: any) =>
    apiClient.post(`${productsEndpoints.downloadTemplate}`, {user_service_id: userServiceId}, {headers:{responseType: "blob"}});