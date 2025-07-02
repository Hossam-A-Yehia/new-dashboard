import React from "react";
import AuthPage from "@/components/templates/AuthPage/AuthPage";
import ForgetPasswordForm from "@/components/organisms/ForgetPasswordForm/ForgetPasswordForm";

const ForgetPasswordPage: React.FC = () => {
  return <AuthPage FormComponent={ForgetPasswordForm} />;
};

export default ForgetPasswordPage;
