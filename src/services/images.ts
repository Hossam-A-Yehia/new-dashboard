import apiClient from "@/config/apiClient";
import ImagesEndpoints from "@/config/endpoints/ImagesEndpoints";
import { getQueryParams } from "@/utils/getQueryParams";


export const getImagesAPI = ({ params }: any) =>{
  const queryString = getQueryParams(params);
  return apiClient.get(`${ImagesEndpoints.Images_link}?${queryString}`);
}  

export const mutateAddImage = (payload: any) =>
  apiClient.post(`${ImagesEndpoints.Images_link}`, payload, {
        headers: {
      'Content-Type': 'multipart/form-data',
    },

  });

export const mutateAddMultiImages = (payload: any) =>
  apiClient.post(`${ImagesEndpoints.muliple_images_link}`, payload,{
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
export const mutateEditImage = ({ payload, rowId }: { payload: any; rowId: string }) =>
  apiClient.put(ImagesEndpoints.Images_link + "/" + rowId, payload, {
        headers: {
      'Content-Type': 'multipart/form-data',
    },

  });

export const mutateDeleteImage = (rowId: string) =>
  apiClient.delete(ImagesEndpoints.Images_link + "/" + rowId);
