import * as Yup from "yup";
import { t } from "i18next";

export const initialValues = {
  category_id: null,
  service_id: [],
};

export const validationSchema = Yup.object().shape({
  category_id: Yup.object()
    .nullable()
    .shape({
      label: Yup.string().required(() => t("update_user_services.Message.CategoryLabelRequired")),
      value: Yup.string().required(() => t("update_user_services.Message.CategoryIDRequired")),
    })
    .required(() => t("update_user_services.Message.CategoryRequired")),
  service_id: Yup.array()
    .min(1, () => t("update_user_services.Message.Please_select_at_least_one_service"))
    .required(() => t("update_user_services.Message.Service_is_required")),
});
