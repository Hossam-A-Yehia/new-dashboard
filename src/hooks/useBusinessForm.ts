import { useEffect, useMemo, useState } from "react";
import { useMutateEditBusinessUser } from "@/hooks/useUser";
import { useCountryData } from "@/hooks/useCountryData";
import { FormValues } from "@/types/UpdateBusiness";
import {
  SUPPLIER,
  SERVICE_PROVIDER_CONTRACTOR,
  SUPPLIER_CLASSIFICATIONS,
  CONTRACTOR_CLASSIFICATIONS,
  PRICE_RANGE,
  VOLUME_OF_WORK,
  NUMBER_OF_EMPLOYEES,
  YEARS_OF_EXPERIENCE,
  SERVICE_PROVIDER_CRAFTSMEN,
  SERVICE_PROVIDER_FREELANCE,
} from "@/constants/Constants";
import { useOptions } from "@/hooks/useOptions";
import { useUser } from "@/context/UserContext";

export function useBusinessForm() {
  const { userData, isLoading } = useUser();
  const { mutateAsync, isPending: isMutatePutLoading } =
    useMutateEditBusinessUser();
  const { countryOptions, cityOptions } = useCountryData();
  const user_type = userData?.user_type;
  const isSupplier = user_type === SUPPLIER;
  const isCraftsmen = user_type === SERVICE_PROVIDER_CRAFTSMEN;
  const isFreelance = user_type === SERVICE_PROVIDER_FREELANCE;
  const isContractor = user_type === SERVICE_PROVIDER_CONTRACTOR;

  const [initialValues, setInitialValues] = useState<FormValues>({
    business_name: "",
    business_email: "",
    phone: "",
    hotline: "",
    country_id: "",
    city_id: "",
    lat: 0,
    lang: 0,
    classifications: [],
    price_range: 1,
    volume_of_work: 0,
    number_of_employees: 0,
    years_of_experience: 0,
    business_des: "",
    business_des_ar: "",
    logo: "",
    profile: "",
    files: [{ file: null, type: null }]  
  });

  const classification = useMemo(() => {
    return (
      userData?.business_user_detail.classifications.map(
        (classification: any) => classification.classification
      ) || []
    );
  }, [userData]);

  useEffect(() => {
    if (userData) {
      setInitialValues({
        business_name: userData.business_user_detail?.business_name || "",
        business_email: userData.business_user_detail.business_email || "",
        phone: userData.business_user_detail.phone || "",
        hotline: userData.business_user_detail.hotline || "",
        country_id: userData?.business_user_detail.city.country_id || "",
        city_id: userData?.business_user_detail.city_id || "",
        lat: userData.business_user_detail.lat || 0,
        lang: userData.business_user_detail.lang || 0,
        classifications: classification,
        price_range: +userData?.business_user_detail.price_range || 1,
        volume_of_work: +userData?.business_user_detail.volume_of_work || 0,
        number_of_employees:
          userData.business_user_detail.number_of_employees || 0,
        years_of_experience:
          userData.business_user_detail.years_of_experience || 0,
        business_des_ar: userData?.business_user_detail.business_des_ar || "",
        business_des: userData?.business_user_detail.business_des || "",
        logo: userData?.business_user_detail.logo || "",
        profile: userData?.business_user_detail.profile || "",
        files: userData.business_user_detail?.files.length
        ? userData.business_user_detail.files.map((file: { url: string; type: string }) => ({
            file: file.url,
            type: file.type,
          }))
        : [{ file: "", type: "" }],

      });
    }
  }, [userData, classification]);

  const supplierClassificationsOptions = useOptions({
    options: SUPPLIER_CLASSIFICATIONS,
    labelKey: "label",
    valueKey: "id",
  });

  const contractorClassificationsOptions = useOptions({
    options: CONTRACTOR_CLASSIFICATIONS,
    labelKey: "label",
    valueKey: "id",
  });

  const priceRangeOptions = useOptions({
    options: PRICE_RANGE,
    labelKey: "label",
    valueKey: "id",
  });

  const volumeOfWorkOptions = useOptions({
    options: VOLUME_OF_WORK,
    labelKey: "label",
    valueKey: "id",
  });

  const numberOfEmployeesOptions = useOptions({
    options: NUMBER_OF_EMPLOYEES,
    labelKey: "label",
    valueKey: "id",
  });

  const yearsOfExperienceOptions = useOptions({
    options: YEARS_OF_EXPERIENCE,
    labelKey: "label",
    valueKey: "id",
  });

  return {
    initialValues,
    isMutatePutLoading,
    mutateAsync,
    countryOptions,
    cityOptions,
    supplierClassificationsOptions,
    contractorClassificationsOptions,
    priceRangeOptions,
    volumeOfWorkOptions,
    numberOfEmployeesOptions,
    yearsOfExperienceOptions,
    isSupplier,
    userId: userData?.business_user_detail?.id,
    isContractor,
    isLoading,
    isCraftsmen,
    isFreelance,
  };
}
