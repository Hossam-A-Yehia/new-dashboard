import Label from "@/components/atoms/Label/Label";
import { OptionType } from "@/types/Molecules";
import { Field, FieldProps } from "formik";
import React from "react";
import { IoMdWarning } from "react-icons/io";

interface RadioGroupProps {
  options: OptionType[];
  name: string;
  selectedValue: number;
  label?: string;
  error?: string;
  touched?: boolean;
  required?: boolean;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  name,
  label,
  error,
  touched,
  required,
}) => (
  <Field name={name}>
    {({ field, form }: FieldProps) => (
      <div className="flex flex-col my-4" data-testid={name}>
        {label && (
          <Label htmlFor={name} required={required}>
            {label}
          </Label>
        )}
        <ul className="flex gap-4">
          {options.map((option) => (
            <li key={option.value}>
              <input
                type="radio"
                id={String(option.value)}
                name={name}
                value={option.value}
                className="hidden peer"
                checked={field.value === option.value}
                onChange={(e) => {
                  form.setFieldValue(name, Number(e.target.value));
                }}
              />
              <label
                htmlFor={String(option.value)}
                className="flex justify-center items-center border-[1px] border-[#787878] rounded-2xl px-4 py-2 text-[#787878] peer-checked:border-main peer-checked:bg-main peer-checked:text-white cursor-pointer duration-100"
              >
                <div className="block">
                  <div className="w-full text-sm font-normal">
                    {option.label}
                  </div>
                </div>
              </label>
            </li>
          ))}
        </ul>
        {error && touched && (
          <div className="flex items-center mt-2 text-red-500">
            <IoMdWarning className="w-4 h-4 mr-2" />
            <span className="text-xs font-medium">{error}</span>
          </div>
        )}
      </div>
    )}
  </Field>
);

export default RadioGroup;
