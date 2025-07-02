import React from "react";
import clsx from "clsx";
import "./alert.css";
import { AlertProps } from "@/types/Atoms";
import { IoAlertCircleOutline } from "react-icons/io5";

const Alert: React.FC<AlertProps> = ({ type, message }) => {
  if (!message) return null;

  const alertClasses = {
    success: {
      container: "alert-success",
      icon: "icon-success",
      label: "Success alert!",
    },
    warning: {
      container: "alert-warning",
      icon: "icon-warning",
      label: "Warning alert!",
    },
    error: {
      container: "alert-error",
      icon: "icon-error",
      label: "Danger alert!",
    },
    info: {
      container: "alert-info",
      icon: "icon-info",
      label: "Info alert!",
    },
  };

  const { container, icon } = alertClasses[type];

  return (
    <div
      role="alert"
      className={clsx("alert-container flex items-center gap-2", container)}
    >
      <IoAlertCircleOutline className={clsx(icon, "text-lg")} />
      <p className={clsx(icon, "text-sm")}>{message}</p>
    </div>
  );
};

export default Alert;
