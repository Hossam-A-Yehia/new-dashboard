export const getQueryParams = (params: any) => {
  const searchParams = new URLSearchParams();

  params.forEach((param: { key: string; value: string; }) => {
    if (param.key && param.value) {
      searchParams.append(param.key, param.value);
    }
  });

  return searchParams.toString();
};
