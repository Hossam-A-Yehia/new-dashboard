export interface CategoryNode {
  id: string;
  name_en: string;
  children?: CategoryNode[];
  services: any;
  [key: `name_${string}`]: string | undefined;
}
export interface GetRfpBusinessUsersParams {
  paginate?: true | undefined;
  serviceId: number | undefined;
  city: any;
  cityId: any;
  priceRanges: number[];
  volumOfWork: number[];
  yearsOfExperience: number[];
  classifications: number[];
  page: number | string;
}

export interface UsersListProps {
  setStep: (step: number) => void;
  setIds: (ids: { ids: string[] }) => void;
  city: number | undefined;
  service: number | undefined;
  isMutatePutLoading: boolean;
  isAsk?: boolean;
}
export interface RFQsType {
  invitable: any;
  id: number;
  subject: string;
  description: string;
  valid_until: string | null;
  status: number;
  user_id: number;
  service_id: number;
  city_id: number;
  created_at: string;
  updated_at: string;
  service: {
    [key: `name_${string}`]: string | undefined;
    id: number;
    name_ar: string;
    name_en: string;
    category: {
      name_ar: string;
      name_en: string;
      [key: `name_${string}`]: string | undefined;
    };
  };
  files: any[];
}

export interface GetQuotationsParams {
  discussionable_id: string;
  user_id: string | number;
  discussionable_type?: number;
}

interface BusinessUserDetail {
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
  accomplished_projects_count: null | number;
  main_clients: null | string;
  business_des: string;
  hotline: null | string;
  show_in_JB: null | boolean;
  calls: number;
}

interface User {
  id: number;
  created_by: null | number;
  username: string;
  email: string;
  phone: string;
  email_verified_at: string;
  phone_verified_at: null | string;
  user_type: number;
  account_status: number;
  birth_date: null | string;
  gender: string;
  experience_level: null | string;
  referral_code: string;
  city_id: number;
  deleted_at: null | string;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  user_type_value: string;
  country_id: number;
  business_user_detail: BusinessUserDetail;
}

interface File {
  id: number;
  url: string;
  type: number;
  fileable_id: number;
  fileable_type: string;
  created_at: string;
  updated_at: string;
}

interface NotifiableUser {
  user_id: string;
  status: number;
}

interface Discussionable {
  id: number;
  notifiable_users: NotifiableUser[];
  status: number;
}

export interface QuotationsType {
  id: string;
  discussionable_id: number;
  discussionable_type: string;
  user_id: number;
  owner_id: number;
  details: string;
  budget: string;
  created_at: string;
  updated_at: string;
  user: User;
  files: File[];
  discussionable: Discussionable;
}
