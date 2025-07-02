export interface StructuredUserForAsk {
  title: string;
  content: string;
  service_id: string;
  notifiable_users: string[];
  files: any;
  type: number;
}

export interface GetAskBusinessUsersParams {
  serviceId: number | undefined;
  priceRanges: number[];
  volumOfWork: number[];
  yearsOfExperience: number[];
  classifications: number[];
}

interface Category {
  id: number;
  parent_id: number;
  name_ar: string;
  name_en: string;
  created_at: string;
  updated_at: string;
  alias: string;
  has_ideas: number;
  [key: `name_${string}`]: string | undefined;
}

interface Service {
  id: number;
  name_ar: string;
  name_en: string;
  category_id: number;
  created_at: string;
  updated_at: string;
  service_type: number;
  category: Category;
  [key: `name_${string}`]: string | undefined;
}

interface User {
  id: number;
  created_by: number;
  username: string;
  email: string;
  phone: string;
  email_verified_at: string;
  phone_verified_at: string;
  user_type: number;
  account_status: number;
  birth_date: string | null;
  gender: string;
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

export interface Ask {
  invitable: any;
  id: number;
  content: string;
  user_id: number;
  service_id: number;
  created_at: string;
  updated_at: string;
  messageable: number;
  accepted_thread_id: number | null;
  notifiable_users: string[];
  title: string;
  service: Service;
  user: User;
  files: File[];
}

interface Invitable {
  id: number;
  title: string;
  content: string;
  status: number;
  service_id: number;
  user_id: number;
  notifiable_users: [];
  service: Service;
  files: File[];
  user: User;
}

export interface ReceivedAsk {
  id: number;
  invitable_id: number;
  invitable_type: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  invitable: Invitable;
}
