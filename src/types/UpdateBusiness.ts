export interface FormValues {
  business_name: string;
  business_des_ar: string;
  business_des: string;
  business_email: string;
  phone: string;
  country_id: string;
  city_id: string;
  years_of_experience: number;
  volume_of_work: number;
  price_range: number;
  number_of_employees: number;
  classifications: [];
  hotline: string;
  lat: number;
  lang: number;
  profile: string;
  logo: string;
  files: { file: string | null; type: string | null }[];

}
