import { t } from "i18next";
import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  business_name: Yup.string().required("Business name is required"),
  business_email: Yup.string()
    .email("Invalid email format")
    .matches(/^[\w.-]+@[\w.-]+\.\w+$/, "Invalid email format")
    .required("Business email is required"),

  phone: Yup.string()
    .matches(/^\+?[0-9]{8,15}$/, t("auth.register.invalid_phone"))
    .nullable(),
  hotline: Yup.string(),
  country_id: Yup.string().required("Country is required"),
  city_id: Yup.string().required("City is required"),
  lat: Yup.string(),
  lang: Yup.string(),
  classifications: Yup.array(),
  price_range: Yup.number().min(1).optional(),
  volume_of_work: Yup.number().min(0).optional(),
  number_of_employees: Yup.number().min(0).optional(),
  years_of_experience: Yup.number().min(0).optional(),
  business_des: Yup.string()
    .trim()
    .min(10, "Business description must be at least 10 characters long")
    .required("Business description is required"),
    business_des_ar: Yup.string()
    .trim()
    .min(10, "Business description must be at least 10 characters long")
    .optional(),
});
