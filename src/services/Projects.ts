import apiClient from "@/config/apiClient";
import projectsEndpoints from "@/config/endpoints/projectsEndpoints";

interface GetProjectsParams {
  page?: number;
  title?: string;
  userId?: number;
  username?: string;
  description?: string;
  projectId?: number;
  category?: string;
}

export const getProjectsAPI = (params: GetProjectsParams) => {
  const {
    page = 1,
    title,
    userId,
    username,
    description,
    projectId,
    category,
  } = params;

  const queryParams = [`page=${page}`];

  if (title !== undefined && title.trim()) {
    queryParams.push(`filters[$or][0][title_en][$contains]=${title}`);
    queryParams.push(`filters[$or][1][title_ar][$contains]=${title}`);
  }
  if (description !== undefined && description.trim()) {
    queryParams.push(
      `filters[$or][0][description_en][$contains]=${description}`
    );
    queryParams.push(
      `filters[$or][1][description_ar][$contains]=${description}`
    );
  }

  if (username !== undefined) {
    queryParams.push(
      `filters[businessUser][user][username][$contains]=${username}`
    );
  }
  
  if (category !== undefined) {
    queryParams.push(
      `filters[categories][name_en][$contains]=${category}`
    );
  }
  if (projectId !== undefined) {
    queryParams.push(`filters[id][$eq]=${projectId}`);
  }

  if (userId) {
    queryParams.push(`filters[businessUser_id][$eq]=${userId}`);
  }

  const queryString = queryParams.join("&");
  return apiClient.get(`${projectsEndpoints.projects}?${queryString}`, { headers: { paginate: true } });
};

export const mutateAddProject = (data: any) =>
  apiClient.post(`${projectsEndpoints.projects}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

interface EditProjectParams {
  data: any; 
  id: number;
}

export const mutateEditProject = ({ data, id }: EditProjectParams) =>
  apiClient.put(projectsEndpoints.projects + "/" + id, data);

export const mutateDeleteProject = (id: string) =>
  apiClient.delete(projectsEndpoints.projects + "/" + id);
