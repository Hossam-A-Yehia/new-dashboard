import React from "react";
import { Field, FieldProps } from "formik";
import { IoMdWarning } from "react-icons/io";
import Select, { SingleValue } from "react-select";
import Label from "@/components/atoms/Label/Label";
import "./selectInput.css";
import { OptionType, SelectInputProps } from "@/types/Molecules";

const SelectInput: React.FC<SelectInputProps> = ({
  id,
  name,
  label,
  options,
  placeholder,
  required,
  error,
  touched,
  dataTestid,
  onChange,
  isDisabled,
  loading,
  value,
  additionalClasses,
}) => (
  <div
    className={`select-input-container ${additionalClasses || ""}`}
    data-testid={dataTestid}
  >
    {label && (
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
    )}
    <Field name={name}>
      {({ field, form }: FieldProps) => (
        <div className="relative z-10">
          <Select
            className="text-sm"
            {...field}
            id={id}
            name={name}
            required={required}
            options={options}
            isDisabled={isDisabled}
            isLoading={loading}
            placeholder={placeholder || "Select an option"}
            value={
              field.value
                ? options.find((option) => option.value === field.value) ||
                  value ||
                  null
                : null
            }
            onChange={
              onChange
                ? onChange
                : (newValue: SingleValue<OptionType>) => {
                    form.setFieldValue(name, newValue?.value);
                  }
            }
            classNamePrefix="react-select"
            menuPortalTarget={document.body}
            styles={{
              control: (provided) => ({
                ...provided,
                padding: "0.2rem",
                borderRadius: "0.375rem",
                borderColor: touched && error ? "#f87171" : "#e5e7eb",
                boxShadow: "none",
                "&:hover": {
                  borderColor: touched && error ? "#f87171" : "#3b82f6",
                },
              }),
              menu: (provided) => ({
                ...provided,
                borderRadius: "0.375rem",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#fff",
                zIndex: 9999,
              }),
              option: (provided, state) => ({
                ...provided,
                backgroundColor: state.isSelected ? "#3b82f6" : "#fff",
                color: state.isSelected ? "#fff" : "#374151",
                padding: "0.5rem",
                "&:hover": {
                  backgroundColor: state.isSelected ? "#3b82f6" : "#f3f4f6",
                },
              }),
              menuPortal: (base) => ({
                ...base,
                zIndex: 9999,
              }),
            }}
          />
        </div>
      )}
    </Field>
    {error && touched && (
      <div className="select-input-error flex items-center text-red-500 rounded-md pt-2">
        <IoMdWarning className="mr-2 text-xs" />
        <span className="select-input-error-text">{error}</span>
      </div>
    )}
  </div>
);

export default SelectInput;
