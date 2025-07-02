import { useMutation, useQuery } from '@tanstack/react-query';

import { getIdeasAPI, mutateAddIdea, mutateDeleteIdea, mutateEditIdea } from '../services/Ideas';

export function useFetchIdeas(...params: [any]) {
  return useQuery({
    queryKey: ['ideas', ...params],
    queryFn: () => getIdeasAPI(...params),
    staleTime: 1000,
  });
}

export function useMutateAddIdea() {
  return useMutation({
    mutationFn: mutateAddIdea,
  });
}

export function useMutateEditIdea() {
  return useMutation({
    mutationFn: mutateEditIdea,
  });
}

export function useMutateDeleteIdea() {
  return useMutation({
    mutationFn: mutateDeleteIdea,
  });
}
