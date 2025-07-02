import React from "react";
import AuthPage from "@/components/templates/AuthPage/AuthPage";
import ResetPasswordForm from "@/components/organisms/ResetPasswordForm/ResetPasswordForm";

const ResetPasswordPage: React.FC = () => {
  return <AuthPage FormComponent={ResetPasswordForm} />;
};

export default ResetPasswordPage;
