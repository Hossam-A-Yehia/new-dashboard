import React from "react";
import { ButtonProps } from "@/types/Atoms";
import clsx from "clsx";

interface SocialButtonProps extends ButtonProps {
  icon: React.ReactNode;
  label: string;
  additionalClasses: string;
  onClick: () => void;
  isDisabled?: boolean;
}

const SocialButton: React.FC<SocialButtonProps> = ({
  icon,
  label,
  onClick,
  additionalClasses = "",
  isDisabled,
}) => (
  <button
    disabled={isDisabled}
    onClick={onClick}
    className={clsx(
      "flex items-center justify-center w-full py-2 px-4 border rounded-md transition-colors duration-300",
      additionalClasses
    )}
  >
    <span className="mr-2 rtl:ml-2">{icon}</span>
    {label}
  </button>
);

export default SocialButton;
