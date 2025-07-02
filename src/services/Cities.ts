import apiClient from "@/config/apiClient";
import countriesEndpoints from "@/config/endpoints/countryCityEndpoints";
import { Country } from "@/types/User";

export const getCountries = (countryId?: number) => {
  const queryParams: string[] = [];
  if (countryId) {
    queryParams.push(`filters[id][$eq]=${countryId}`);
  }

  const queryString = queryParams.join("&");

  return apiClient.get<null, { data: { payload: Country[] } }>(
    `${countriesEndpoints.countries}?${queryString}`
  );
};

export const getCities = async (countryId: string) => {
  const queryParams: string[] = [];

  if (countryId) {
    queryParams.push(`filters[id][$eq]=${countryId}`);
  }
  const queryString = queryParams.join("&");

  const response = await apiClient.get(
    `${countriesEndpoints.cities}?${queryString}`
  );
  return response.data;
};
