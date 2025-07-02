import { Form, Formik } from "formik";
import React from "react";
import MultiSelectInput from "@/components/molecules/MultiSelectInput/MultiSelectInput";
import { t } from "i18next";
import Button from "@/components/atoms/Button/Button";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { containsAnyElement } from "@/utils/generalUtils";
import { useMutateAddUserCategory } from "@/hooks/useCategories";
import { initialValues, validationSchema } from "@/components/templates/UpdateBusiness/UpdateUserCategories/ValidationSchema";

interface UserCategoryFormProps {
  userData: any;
  mappedCategories: any;
  userCategoryIds: number[];
}

const UserCategoryForm: React.FC<UserCategoryFormProps> = ({
  userData,
  mappedCategories,
  userCategoryIds,
}) => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending: isMutateLoading } =
    useMutateAddUserCategory();

  const handleSubmit = async (values: any, { resetForm, setErrors }: any) => {
    const newSelectedCategoryIds = values.category_id?.map(
      (category: { value: number }) => category.value
    );

    if (containsAnyElement(userCategoryIds, newSelectedCategoryIds)) {
      setErrors({
        category_id: t("update_user_categories.repet_categories"),
      });
    } else {
      const structuredData = values.category_id.map(
        (el: { value: number }) => ({
          user_id: userData?.id,
          category_id: el.value,
        })
      );

      try {
        await mutateAsync(structuredData);
        queryClient.invalidateQueries({
          queryKey: ["userCategories", userData?.id],
        });
        toast.info(t("update_user_categories.added_succcess_message"));
        resetForm();
      } catch (err: any) {
        toast.error(t(err.message || "An error occurred"));
      }
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ touched, errors }) => (
        <Form className="tablelist-form">
          <div className="flex items-center gap-10">
            <div className="w-full">
              <MultiSelectInput
                id="category_id"
                name="category_id"
                label={t("update_user_categories.select_your_categories")}
                options={mappedCategories}
                placeholder={t(
                  "update_user_categories.select_your_categories_placeholder"
                )}
                touched={!!touched.category_id}
                error={errors.category_id as string}
              />
            </div>
            <div className="w-1/6 mt-5">
              <Button disabled={isMutateLoading} variant="main" type="submit">
                {t("update_user_categories.add_category")}
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default UserCategoryForm;
