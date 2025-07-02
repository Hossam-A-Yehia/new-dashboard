import React, { useState } from "react";
import { Formik, Form, FormikHelpers } from "formik";
import FormField from "@/components/molecules/FormField/FormField";
import Button from "@/components/atoms/Button/Button";
import NavLink from "@/components/atoms/NavLink/NavLink";
import Alert from "@/components/atoms/Alert/Alert";
import { handleError } from "@/utils/handleError";
import { useForgetPassword } from "@/hooks/useAuth";
import { initialValues, validationSchema } from "./ForgetPasswordValidation";
import { ForgetPasswordFormValues } from "@/types/Auth";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";

const ForgetPasswordForm: React.FC = () => {
  const mutation = useForgetPassword();
  const { mutate, isPending, error } = mutation;
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (
    values: ForgetPasswordFormValues,
    actions: FormikHelpers<ForgetPasswordFormValues>
  ) => {
    const targetKey = /^(?:\+|00)\d{1,4}\d{11}$/.test(values.emailOrPhone)
      ? "phone"
      : "email";

    mutate(
      { target_key: targetKey, target_value: values.emailOrPhone },
      {
        onSuccess: () => {
          actions.setSubmitting(false);
          setSuccessMessage(t("auth.forget_password.success_message"));
          setTimeout(() => {
            navigate("/reset-password");
          }, 3000);
        },
        onError: (err) => {
          actions.setSubmitting(false);
          handleError(err);
        },
      }
    );
  };

  return (
    <div className="w-full max-w-[36rem] p-8 space-y-6">
      <div>
        <h2 className="form-heading">{t("auth.forget_password.title")}</h2>
        <p className="form-description">{t("auth.forget_password.desc")}</p>
      </div>

      {successMessage && <Alert type="success" message={successMessage} />}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched }) => (
          <Form className="space-y-4">
            <FormField
              id="emailOrPhone"
              label={t("auth.forget_password.email_or_phone")}
              type="text"
              name="emailOrPhone"
              placeholder={t("auth.forget_password.placeholder_email_or_phone")}
              touched={touched.emailOrPhone}
              errors={errors.emailOrPhone}
            />
            <Button
              type="submit"
              variant="main"
              loading={isPending}
              dataTestid="submit-button"
            >
              {t("auth.forget_password.button")}
            </Button>
            {error && <Alert type="error" message={handleError(error)} />}
            <div className="signup-link">
              {t("auth.forget_password.back_login")}
              <NavLink href="/login">
                {t("auth.forget_password.click_here")}
              </NavLink>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ForgetPasswordForm;
