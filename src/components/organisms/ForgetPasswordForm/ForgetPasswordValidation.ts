import * as Yup from "yup";
import { t } from "i18next";

export const validationSchema = Yup.object({
  emailOrPhone: Yup.string()
    .required(t("auth.forget_password.email_or_phone_required"))
    .test(
      "is-email-or-phone",
      t("auth.forget_password.invalid_email_or_phone"),
      function (value) {
        if (!value) return false;
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return true;
        if (/^\+\d{1,4}\d{11}$/.test(value)) return true;
        return false;
      }
    ),
});

export const initialValues = {
  emailOrPhone: "",
};
