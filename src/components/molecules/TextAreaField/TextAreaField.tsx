import Label from "@/components/atoms/Label/Label";
import TextArea from "@/components/atoms/TextArea/TextArea";
import { FormFieldProps } from "@/types/Molecules";
import { Field, FieldProps } from "formik";
import React from "react";
import { IoMdWarning } from "react-icons/io";

const TextAreaField: React.FC<FormFieldProps> = ({
  id,
  required,
  placeholder,
  name,
  label,
  errors,
  touched,
}) => (
  <div className="flex flex-col mb-2">
    {label && (
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
    )}
    <Field name={name}>
      {({ field }: FieldProps) => (
        <div className="relative">
          <TextArea
            {...field}
            id={id}
            required={required}
            placeholder={placeholder}
            touched={touched}
            errors={errors}
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

export default TextAreaField;
