import apiClient from '@/config/apiClient';
import ideasEndpoints from '@/config/endpoints/ideasEndpoints';

export const getIdeasAPI = (params:any) => {
  const { page = 1, title, userId, username, service, projectId } = params;
  const queryParams = [`page=${page}`];

  if (title !== undefined && title.trim()) {
    queryParams.push(`filters[$or][0][title_en][$contains]=${title}`);
    queryParams.push(`filters[$or][1][title_ar][$contains]=${title}`);
  }
  if (projectId) {
    queryParams.push(`filters[user_project_id][$eq]=${+projectId}`);
  }

  if (userId !== undefined) {
    queryParams.push(`filters[user][users.id][$eq]=${userId}`);
  }

  if (username !== undefined) {
    queryParams.push(`filters[user][username][$contains]=${username}`);
  }

  if (service !== undefined) {
    queryParams.push(
      `filters[$or][0][service][name_ar][$contains]=${service}&filters[$or][1][service][name_en][$contains]=${service}`,
    );
  }

  const queryString = queryParams.join('&');
  return apiClient.get(`${ideasEndpoints.ideas}?${queryString}`, {
    headers: {
      paginate: true,
    },
  });
};

export const mutateAddIdea = (data: any) =>
  apiClient.post(`${ideasEndpoints.ideas}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const mutateEditIdea = ({ data, id }: { data: any; id: string }) =>
  apiClient.put(ideasEndpoints.ideas + '/' + id, data);

export const mutateDeleteIdea = (id: string) => apiClient.delete(ideasEndpoints.ideas + '/' + id);
