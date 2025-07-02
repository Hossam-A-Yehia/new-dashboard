export interface BusinessInfoType {
  id: number;
  business_name: string;
  business_email: string;
  phone: string;
  years_of_experience: number;
  number_of_employees: number;
  volume_of_work: string;
  price_range: string;
  logo: string;
  profile: string;
  city_id: number;
  lang: string;
  lat: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  accomplished_projects_count: number;
  main_clients: string | null;
  business_des: string | null;
  hotline: string | null;
  show_in_JB: boolean | null;
  calls: number;
  user: User;
  city: City;
  files: File[];
  classifications: any[];
  payload?: [];
}

export interface User {
  id: number;
  created_by: number | null;
  username: string;
  email: string;
  phone: string;
  email_verified_at: string | null;
  phone_verified_at: string | null;
  user_type: number;
  account_status: number;
  birth_date: string | null;
  gender: "MALE" | "FEMALE" | null;
  experience_level: string | null;
  referral_code: string;
  city_id: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  user_type_value: string;
  country_id: number;
  city: City;
  subscription: Subscription;
}

export interface City {
  id: number;
  name_ar: string;
  name_en: string;
  country_id: number;
  created_at: string;
  updated_at: string;
  lang: string;
  lat: string;
  country: Country;
  [key: `name_${string}`]: string | undefined;
}

export interface Country {
  id: number;
  name_ar: string;
  name_en: string;
  created_at: string;
  updated_at: string;
  cities: City[];
  [key: `name_${string}`]: string | undefined;
}

export interface File {
  id: number;
  name: string;
  url: string;
  created_at: string;
  updated_at: string;
  type: number;
}

export interface Subscription {
  id: number;
  type: string;
  status: string;
  start_date: string;
  end_date: string;
}
export interface ServicesData {
  payload: {
    data: {
      id: number;
      service_id: number;
      user_id: number;
      user: {
        id: number;
        name: string;
        email: string;
      };
      service: {
        id: number;
        name_ar: string;
        [key: `name_${string}`]: string | undefined;
        name_en: string;
        category_id: number;
        created_at: string;
        updated_at: string;
        service_type: number;
        images: {
          id: number;
          title: string;
          alt: string;
          url: string;
        }[];
        category: {
          id: number;
          name_ar: string;
          name_en: string;
        };
      };
    }[];
  };
}
