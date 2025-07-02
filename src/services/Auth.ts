import apiClient from '@/config/apiClient';
import authEndpoints from '@/config/endpoints/authEndpoints';
import { ForgetPasswordRequest, LoginRequest, ResetPasswordRequest } from '@/types/Auth';

export const Login = async (data: LoginRequest) => {
  const response = await apiClient.post(authEndpoints.login, data);
  return response.data;
};

export const ForgetPassword = async (
  data: ForgetPasswordRequest,
) => {
  const response = await apiClient.post(authEndpoints.forgetPassword, data);
  return response.data;
};
export const ResetPassword = async (data: ResetPasswordRequest) => {
  const response = await apiClient.post(authEndpoints.resetPassword, data);
  return response.data;
};
