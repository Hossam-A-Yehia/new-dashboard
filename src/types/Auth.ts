export interface LoginRequest {
  email?: string;
  phone?: string;
  password: string;
}
export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    phone: string;
    email_verified_at: string | null;
    phone_verified_at: string | null;
    created_at: string;
    updated_at: string;
  };
}
export interface ResgisterRequest {
  username: string;
  email?: string;
  phone?: string;
  password: string;
  user_type: string;
  referral_code?: number;
  first_name: string;
  last_name: string;
  confirm_password: string;
}
export interface RegisterFormValues {
  username: string;
  email: string;
  phone: string;
  password: string;
  user_type: string;
  referral_code: string;
  last_name: string;
  confirm_password: string;
  first_name: string;
  city_id: string;
  country_id: string;
}

export interface RegisterResponse {
  message: string;
  payload: {
    accessToken: string;
    token: {
      id: string;
      user_id: number;
      client_id: number;
      name: string;
      scopes: string[];
      revoked: boolean;
      created_at: string;
      updated_at: string;
      expires_at: string;
    };
  };
}

export interface ForgetPasswordRequest {
  target_key: string;
  target_value: string;
}
export interface ForgetPasswordResponse {
  message: string;
}
export interface ForgetPasswordFormValues {
  emailOrPhone: string;
}
export interface ResetPasswordResponse {
  message: string;
}
export interface ResetPasswordRequest {
  password: string;
  confirm_password: string;
  code: string;
}
export interface VerificationResponse {
  message: string;
}
export interface VerificationRequest {
  code: string;
  email?: string;
  phone?: string;
}
