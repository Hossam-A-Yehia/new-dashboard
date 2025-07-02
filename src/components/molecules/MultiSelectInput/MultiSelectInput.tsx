import React from "react";
import { Field, FieldProps } from "formik";
import { IoMdWarning } from "react-icons/io";
import Select, { MultiValue } from "react-select";
import Label from "@/components/atoms/Label/Label";
import { OptionType, SelectInputProps } from "@/types/Molecules";

const MultiSelectInput: React.FC<SelectInputProps> = ({
  id,
  name,
  label,
  options,
  value,
  placeholder,
  required,
  error,
  touched,
  isDisabled,
  loading,
  targetID,
}) => (
  <div className="select-input-container gap-2" data-testid={id}>
    {label && (
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
    )}
    <Field name={name}>
      {({ field, form }: FieldProps) => {
        const { setFieldValue } = form;
        return (
          <div className="relative">
            <Select
              isMulti
              closeMenuOnSelect={false}
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
                value ||
                (targetID
                  ? options.filter((option) =>
                      field.value?.includes(option.value)
                    )
                  : field.value)
              }
              onChange={(newValue: MultiValue<OptionType>) => {
                setFieldValue(
                  name,
                  targetID ? newValue.map((item) => item.value) : newValue
                );
              }}
              classNamePrefix="react-select"
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
              }}
            />
          </div>
        );
      }}
    </Field>
    {error && touched && (
      <div className="select-input-error">
        <IoMdWarning className="mr-2 text-xs text-red-500" />
        <span className="select-input-error-text">{error}</span>
      </div>
    )}
  </div>
);

export default MultiSelectInput;
