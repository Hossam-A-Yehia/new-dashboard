import React from "react";
import { FormLabel, FormLabelProps as MuiFormLabelProps } from "@mui/material";

interface ExtendedLabelProps extends Omit<MuiFormLabelProps, "htmlFor"> {
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}

const Label: React.FC<ExtendedLabelProps> = ({
  htmlFor,
  children,
  required,
  ...props
}) => {
  return (
<FormLabel
  htmlFor={htmlFor}
  required={required}
  sx={{
    fontSize: "0.8rem",
    fontWeight: 700,
    color: "text.primary",
    "& .MuiFormLabel-asterisk": {
      color: "error.main",
    },
  }}
  {...props}
>
  {children}
</FormLabel>

  );
};

export default Label;