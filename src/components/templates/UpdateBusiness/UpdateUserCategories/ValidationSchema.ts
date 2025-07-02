import * as Yup from "yup";
import { t } from "i18next";

export const initialValues = {
  category_id: "",
};

export const validationSchema = Yup.object().shape({
  category_id: Yup.array()
    .min(1, () => t("common.categories.validation.select_one"))
    .max(3, () => t("common.categories.validation.select_max_three"))
    .required(() => t("common.categories.validation.required")),
});

export const CategoryTypesEnum: any = {
  SERVICE_PROVIDER_DESIGN_FREELANCE: 1,
  SERVICE_PROVIDER_DESIGN_FIRM: 2,
  SERVICE_PROVIDER_CONTRACTOR: 3,
  SERVICE_PROVIDER_CRAFTSMEN: 4,
  SUPPLIER: 5,
};
