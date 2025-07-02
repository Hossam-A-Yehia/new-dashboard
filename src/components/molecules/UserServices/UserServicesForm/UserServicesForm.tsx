import Button from "@/components/atoms/Button/Button";
import {
  initialValues,
  validationSchema,
} from "@/components/templates/UpdateBusiness/UpdateUserServices/ValidationSchema";
import { Form, Formik } from "formik";
import { t } from "i18next";
import React, { useState } from "react";
import SelectInput from "../../SelectInput/SelectInput";
import { useFetchUserCategories } from "@/hooks/useCategories";
import {
  useFetchCategoriesServices,
  useMutateAddUserService,
} from "@/hooks/useServices";
import { useLanguage } from "@/hooks/useLanguage";
import MultiSelectInput from "../../MultiSelectInput/MultiSelectInput";
import { SUPPLIER } from "@/constants/Constants";
import { toast } from "react-toastify";
import { containsAnyElement } from "@/utils/generalUtils";
import { useQueryClient } from "@tanstack/react-query";

function UserServicesForm({
  userId,
  userType,
  userServices,
}: {
  userId: number;
  userType: number;
  userServices: any;
}) {
  const [categoryId, setCategoryId] = useState<number[]>([]);
  const lang = useLanguage();
  const queryClient = useQueryClient();

  const { data: userCategoriesData } = useFetchUserCategories(userId);
  const userCategories = userCategoriesData?.data?.payload;

  const {
    data: { payload: categoriesServices = [] } = {},
    isLoading: isCategoriesServicesLoading,
  } = useFetchCategoriesServices(categoryId);

  const userServicesIds = userServices?.data?.map(
    (service: { service_id: number }) => service.service_id
  );
  const { mutateAsync, isPending: isMutateLoading } = useMutateAddUserService();

  const handleSubmit = async (
    values: { service_id: { label: string; value: number }[] },
    { resetForm, setErrors }: any
  ) => {
    const newSelectedServicesIds = values.service_id?.map(
      (service: { value: number }) => service.value
    );
    if (containsAnyElement(userServicesIds, newSelectedServicesIds)) {
      setErrors({
        service_id: t("update_user_services.repet_services"),
      });
    } else {
      const structuredData = values.service_id.map((el: { value: number }) => ({
        user_id: userId,
        service_id: el.value,
      }));
      mutateAsync({ services: structuredData })
        .then(() => {
          queryClient.invalidateQueries({
            queryKey: ["user-services", userId],
          });
          if (userType === SUPPLIER) {
            toast.info(
              t("update_user_services.added_product_group_succcess_message")
            );
          } else {
            toast.info(
              t("update_user_services.added_services_succcess_message")
            );
          }

          resetForm();
        })
        .catch((err: { message: string }) => {
          toast.error(err.message);
          return err;
        });
    }
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ touched, errors, values, setFieldValue }) => (
        <Form className="tablelist-form">
          <div className="flex items-center gap-10">
            <div className="max-w-[600px] min-w-[400px]">
              <SelectInput
                value={values.category_id || null}
                id="category_id"
                name="category_id"
                label={t("update_user_services.select_your_categories")}
                options={userCategories?.map(
                  (category: {
                    category: { [x: string]: string; id: string };
                  }) => ({
                    label: category.category[`name_${lang}`],
                    value: category.category.id,
                  })
                )}
                onChange={(options: {
                  value: React.SetStateAction<number[]>;
                }) => {
                  setFieldValue("category_id", options);
                  setCategoryId(options.value);
                  setFieldValue("service_id", "");
                }}
                placeholder={t(
                  "update_user_services.select_your_categories_placeholder"
                )}
                error={errors.category_id}
                touched={touched.category_id}
                dataTestid="edit-category"
              />
            </div>
            <div className="max-w-[600px] min-w-[400px]">
              <MultiSelectInput
                id="service_id"
                name="service_id"
                label={
                  userType === SUPPLIER
                    ? t("update_user_services.product_group")
                    : t("update_user_services.services")
                }
                options={categoriesServices?.map(
                  (service: { name_en: string; id: string }) => ({
                    label: service.name_en,
                    value: service.id,
                  })
                )}
                placeholder={
                  userType === SUPPLIER
                    ? t(
                        "update_user_services.select_your_product_group_placeholder"
                      )
                    : t("update_user_services.select_your_services_placeholder")
                }
                touched={!!touched.service_id}
                error={errors.service_id as string}
                isDisabled={
                  categoriesServices?.length === 0 ||
                  isCategoriesServicesLoading ||
                  isMutateLoading
                }
              />
            </div>
            <div className="w-1/6 mt-5">
              <Button variant="main" type="submit">
                {userType === SUPPLIER
                  ? t("update_user_services.add_product_groups")
                  : t("update_user_services.add_servies")}
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default UserServicesForm;
