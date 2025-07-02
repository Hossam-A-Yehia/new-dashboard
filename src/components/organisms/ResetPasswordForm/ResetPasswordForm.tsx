import React, { useState } from "react";
import { Formik, Form, FormikHelpers } from "formik";
import FormField from "@/components/molecules/FormField/FormField";
import Button from "@/components/atoms/Button/Button";
import Alert from "@/components/atoms/Alert/Alert";
import { handleError } from "@/utils/handleError";
import { useResetPassword } from "@/hooks/useAuth";
import { initialValues, validationSchema } from "./ResetPasswordFormValidation";
import { ResetPasswordRequest } from "@/types/Auth";
import { t } from "i18next";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import PinCodeInput from "@/components/atoms/PinInput/PinCodeInput";
import { useNavigate } from "react-router-dom";

const ResetPasswordForm: React.FC = () => {
  const mutation = useResetPassword();
  const { mutate, isPending, error } = mutation;
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (
    values: ResetPasswordRequest,
    actions: FormikHelpers<ResetPasswordRequest>
  ) => {
    mutate(values, {
      onSuccess: () => {
        actions.setSubmitting(false);
        setSuccessMessage(t("auth.reset_password.success_message"));
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      },
      onError: (err) => {
        actions.setSubmitting(false);
        handleError(err);
      },
    });
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
        {({ errors, touched, setFieldValue }) => (
          <Form className="space-y-4">
            <div className="mb-8">
              <PinCodeInput
                onChange={(value) => setFieldValue("code", value)}
                errors={errors.code}
                touched={touched.code}
                name="code"
              />
            </div>
            <div className="form-field-wrapper">
              <FormField
                id="password"
                label={t("auth.register.password")}
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder={t("auth.register.placeholder_password")}
                touched={touched.password}
                errors={errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="input-password-icon"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="form-field-wrapper">
              <FormField
                id="confirm_password"
                label={t("auth.register.confirm_password")}
                type={showPassword ? "text" : "password"}
                name="confirm_password"
                placeholder={t("auth.register.placeholder_password")}
                touched={touched.confirm_password}
                errors={errors.confirm_password}
              />
              <button
                data-testid="eye-button"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="input-password-icon"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <Button type="submit" variant="main" loading={isPending}>
              {t("auth.reset_password.button")}
            </Button>
            {error && <Alert type="error" message={handleError(error)} />}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ResetPasswordForm;
