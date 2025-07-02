import { createContext, useContext, ReactNode } from "react";
import Cookies from "js-cookie";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getUser } from "../services/User";

interface UserData {
  business_user_detail: {
    id: number;
    profile: string;
    business_des: string;
    years_of_experience: number;
    number_of_employees: number;
    volume_of_work: any;
    price_range: any;
    classifications: any;
    lang: number;
    lat: number;
    hotline: string;
    phone: string;
    business_email: string;
    business_name: string;
    logo: string;
  };
  user_type_value?: string;
  username: string;
  user_type: number;
  city_id: any;
  country_id: string;
  phone: string;
  last_name: string;
  first_name: string;
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  phone_verified_at: string | null;
  account_status: number;
  birth_date: string | null;
  gender: "MALE" | "FEMALE" | null;
  experience_level: string | null;
  referral_code: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  created_by: number | null;
  city: any[];
  subscription: any[];
}

interface UserContextValue {
  userData: any | undefined;
  isLoading: boolean;
  isError: boolean;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const token = Cookies.get("authToken") || Cookies.get("signUpToken");

  const {
    data: userData,
    isLoading,
    isError,
  }: UseQueryResult<UserData, Error> = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    enabled: !!token,
  });

  return (
    <UserContext.Provider value={{ userData, isLoading, isError }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextValue => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
