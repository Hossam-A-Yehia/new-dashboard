import apiClient from '@/config/apiClient';
import variantsEndpoints from '@/config/endpoints/variantsEndpoints';
import { getQueryParams } from '@/utils/getQueryParams';

export const getVariantsAPI = ({ params }: { params: Record<string, any> }) => {
  const queryString = getQueryParams(params);
  return apiClient.get(`${variantsEndpoints.variants}?${queryString}`);
};

export const mutateAddVariant = (rowData: any) =>
  apiClient.post(`${variantsEndpoints.variants}`, rowData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const mutateEditVariant = ({ data, id }: { data: any; id: string | number }) =>
  apiClient.put(variantsEndpoints.variants + '/' + id, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const mutateDeleteVariant = (rowId: string) =>
  apiClient.delete(variantsEndpoints.variants + '/' + rowId);
