import { useFetchCountries } from "@/hooks/useCountries";
import { useLanguage } from "./useLanguage";

export const useCountryData = () => {
  const lang = useLanguage();
  const { data: countriesData, isLoading: isCountriesLoading } =
    useFetchCountries();
  const countries = countriesData?.payload || [];

  const countryOptions = countries.map(
    (country: {
      name_en: string;
      id: string;
      [key: `name_${string}`]: string | undefined;
    }) => ({
      label: country[`name_${lang}`] || country.name_en,
      value: country.id,
    })
  );

  const cityOptions = (countryId: string | number | undefined) => {
    if (!countryId) return [];
    const selectedCountry = countries.find(
      (country: { id: string }) => country.id === countryId
    );
    return (
      selectedCountry?.cities?.map(
        (city: {
          name_en: string;
          id: string;
          [key: `name_${string}`]: string | undefined;
        }) => ({
          label: city[`name_${lang}`] || city.name_en,
          value: city.id,
        })
      ) || []
    );
  };
  const cityOptionsFilter = (countryIds: (string | number)[] | undefined) => {
    if (!countryIds || countryIds.length === 0) return [];

    const selectedCountries = countries.filter((country: { id: string }) =>
      countryIds.includes(country.id)
    );
    const cities = selectedCountries.flatMap(
      (country: { cities: { name_en: string; id: string }[] }) =>
        country.cities.map((city: { name_en: string; id: string }) => ({
          label: city.name_en,
          value: city.id,
        }))
    );

    return cities;
  };

  return {
    countryOptions,
    cityOptions,
    isCountriesLoading,
    cityOptionsFilter,
  };
};
