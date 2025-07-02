import { useMutation, useQuery } from '@tanstack/react-query';

import {
  getProjectsAPI,
  mutateAddProject,
  mutateDeleteProject,
  mutateEditProject,
} from '../services/Projects';

export interface GetProjectsParams {
  isEnabled?: boolean;
  [key: string]: any;
}

export function useFetchProjects(params: GetProjectsParams ) {
  return useQuery({
    queryKey: ['projects', ...Object.entries(params)],
    queryFn: () => {
      // Exclude isEnabled from params before passing to API
      const { isEnabled, ...filteredParams } = params;
      return getProjectsAPI(filteredParams);
    },
    enabled: params.isEnabled,
  });
}

export function useMutateAddProject() {
  return useMutation({
    mutationFn: mutateAddProject,
  });
}

export function useMutateEditProject() {
  return useMutation({
    mutationFn: mutateEditProject,
  });
}

export function useMutateDeleteProject() {
  return useMutation({
    mutationFn: mutateDeleteProject,
  });
}
