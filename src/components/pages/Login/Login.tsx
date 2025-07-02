import React from "react";
import LoginForm from "@/components/organisms/LoginForm/LoginForm";
import AuthPage from "@/components/templates/AuthPage/AuthPage";
import { useTranslation } from "react-i18next";

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  return <AuthPage title={t("logo")} FormComponent={LoginForm} />;
};

export default LoginPage;
