import React from "react";
import { Field, FieldProps } from "formik";
import { IoMdWarning } from "react-icons/io";
import { FormFieldProps } from "@/types/Molecules";
import Input from "@/components/atoms/Input/Input";
import Label from "@/components/atoms/Label/Label";

const FormField: React.FC<FormFieldProps> = ({
  id,
  type = "text",
  required,
  placeholder,
  name,
  label,
  errors,
  touched,
  readOnly,
  onClick,
  value,
  disabled,
  dataTestid,
  onBlur,
}) => (
  <div className="flex flex-col mb-2" data-testid={dataTestid}>
    {label && (
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
    )}
    <Field name={name}>
      {({ field }: FieldProps) => (
        <div className="relative">
          <Input
            {...field}
            id={id}
            onBlur={onBlur}
            type={type as string}
            required={required}
            placeholder={placeholder}
            touched={touched}
            errors={errors}
            readOnly={readOnly}
            onClick={onClick}
            value={value}
            disabled={disabled}
          />
        </div>
      )}
    </Field>
    {errors && touched && (
      <div className="flex items-center text-red-500 rounded-md pt-2">
        <IoMdWarning
          className="size-3 mr-2 rtl:ml-2"
          data-testid="warning-icon"
        />
        <span className="text-xs font-medium">{errors}</span>
      </div>
    )}
  </div>
);

export default FormField;
