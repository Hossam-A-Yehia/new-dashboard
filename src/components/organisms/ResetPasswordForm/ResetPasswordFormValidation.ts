import * as Yup from "yup";
import { t } from "i18next";

export const validationSchema = Yup.object({
  code: Yup.string().required("Code is required"),
  password: Yup.string()
    .required(t("auth.reset_password.password_is_required"))
    .min(6, t("auth.reset_password.password_not_valid")),
  confirm_password: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required(t("auth.reset_password.password_is_required")),
});

export const initialValues = {
  code: "",
  password: "",
  confirm_password: "",
};
