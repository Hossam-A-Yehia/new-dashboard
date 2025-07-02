import { ForgetPassword, Login, ResetPassword } from '@/services/Auth';
import { useMutation } from '@tanstack/react-query';

export const useLogin = () => {
  return useMutation({
    mutationFn: Login,
  });
};

export const useForgetPassword = () => {
  return useMutation({
    mutationFn: ForgetPassword,
  });
};
export const useResetPassword = () => {
  return useMutation({
    mutationFn: ResetPassword,
  });
};
