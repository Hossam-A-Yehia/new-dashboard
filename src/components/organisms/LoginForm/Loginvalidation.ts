import * as Yup from 'yup';
import { useLogin } from '@/hooks/useAuth';
import Cookies from 'js-cookie';
import { t } from 'i18next';

export const validationSchema = Yup.object().shape({
  emailOrPhone: Yup.string()
    .required(t('auth.login.email_or_phone_required'))
    .test('is-email-or-phone', t('auth.login.invalid_email_or_phone'), function (value) {
      if (!value) return false;
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return true;
      if (/^\+\d{1,4}\d{10,14}$/.test(value)) return true;
      return false;
    }),
    password: Yup.string()
    .required(t("auth.login.password_is_required"))
    .test(
      "strong-password",
      t("auth.register.password_requirements"),
      (value) =>
        !!value &&
        value.length >= 6 &&
        /[A-Z]/.test(value) &&
        /[a-z]/.test(value) &&
        /[0-9]/.test(value) &&
        /[!@#$%^&*(),.?":{}|<>]/.test(value)
    ),});

export const handleLoginSubmit =
  (mutate: ReturnType<typeof useLogin>['mutate']) =>
  async (values: { emailOrPhone: string; password: string }) => {
    const targetKey = /^\+?\d{10,14}$/.test(values.emailOrPhone) ? 'phone' : 'email';

    try {
      await mutate(
        {
          password: values.password,
          [targetKey]: values.emailOrPhone,
        },
        {
          onSuccess: (data) => {
            const token = data.token;
            Cookies.set('authToken', token, { expires: 7, secure: true });
            window.location.replace('/');
          },
          onError: (err) => {
            console.error('Unexpected error:', err);
          },
        },
      );
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
