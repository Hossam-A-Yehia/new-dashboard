import { getCountries, getCountryCitiesAPI } from "@/services/Countries";
import { useQuery } from "@tanstack/react-query";

export function useFetchCountries() {
  return useQuery({
    queryKey: ["countries"],
    queryFn: getCountries,
    staleTime: Infinity,
  });
}

export function useFetchCountryCities({ countryId }: { countryId: number }) {
  return useQuery({
    queryKey: ["cities", countryId],
    queryFn: () => getCountryCitiesAPI(countryId),
    enabled: Boolean(countryId),
    staleTime: Infinity,
  });
}
