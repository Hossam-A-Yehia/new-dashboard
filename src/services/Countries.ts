import apiClient from "@/config/apiClient";
import countriesEndpoints from "@/config/endpoints/countriesEndpoints";

export const getCountries = async () => {
  const response = await apiClient.get(`${countriesEndpoints.countries}`);
  return response.data;
};
export const getCountryCitiesAPI = async (countryId: number) => {
  const response = await apiClient.get(
    `${countriesEndpoints.cities}?country_id=${countryId}`
  );
  return response.data;
};
