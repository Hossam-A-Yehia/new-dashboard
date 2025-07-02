import { t } from "i18next";
import * as Yup from "yup";
export const editInitialValues = (selectedRow: { category_id: any; name_en: any; name_ar: any; service_type: any; }) => {
  const values = {
    category: selectedRow.category_id,
    name_en: selectedRow.name_en,
    name_ar: selectedRow.name_ar,
    service_type: selectedRow.service_type,
  };
  return values;
};

export const initialValues = () => {
  const values = {
    category: "",
    name_en: "",
    name_ar: "",
    service_type: "",
  };
  return values;
};
export const getValidationSchema = () =>
  Yup.object().shape({
  category: Yup.object().required("suggestServices.validation.Category_Required"),
  name_en: Yup.string()
    .trim()
    .min(3, t("suggestServices.validation.NameEn_Minimum_3"))
    .max(100, "suggestServices.validation.NameEn_Maximun_100")
    .required(t("suggestServices.validation.Name_Required")),
  name_ar: Yup.string()
    .trim()
    .min(3, t("suggestServices.validation.NameAr_Minimum_3"))
    .max(100, "suggestServices.validation.NameAr_Maximun_100")
    .optional(),
});
