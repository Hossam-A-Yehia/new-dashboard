import React from "react";
import { Field, FieldProps } from "formik";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

interface Feature {
  text: string;
  enabled: boolean;
}

interface PackageType {
  value: number;
  label: string;
  price: number;
  description?: string;
  features: Feature[];
}

interface RadioGroupProps {
  options: PackageType[];
  name: string;
  label?: string;
  error?: string;
  touched?: boolean;
  required?: boolean;
}

const SubscriptionGroupRadio: React.FC<RadioGroupProps> = ({
  options,
  name,
  label,
  error,
  touched,
  required,
}) => (
  <Field name={name}>
    {({ field, form }: FieldProps) => (
      <div className="space-y-6">
        {label && (
          <label className="block text-xl font-medium text-gray-800">
            {label}
            {required && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {options.map((option) => (
            <div
              key={option.value}
              className="relative group"
            >
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
                className={`
                  block h-full rounded-2xl border-2 p-6 bg-white
                  transition-all duration-300 cursor-pointer
                  peer-checked:border-indigo-500 peer-checked:shadow-lg
                  hover:shadow-md hover:border-indigo-300
                  group-hover:scale-[1.02] group-hover:shadow-md
                `}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-semibold text-gray-900">
                      {option.label}
                    </h3>
                    <FaCheckCircle
                      className={`
                        w-7 h-7 text-indigo-500 transition-all duration-300
                        ${field.value === option.value ? "opacity-100 scale-100" : "opacity-0 scale-75"}
                      `}
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-gray-900">
                      ${option.price.toFixed(2)}
                    </span>
                    <span className="text-gray-500 text-base mb-1">
                      /month
                    </span>
                  </div>
                  {option.description && (
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {option.description}
                    </p>
                  )}
                  <ul className="space-y-3 pt-4 border-t border-gray-100">
                    {option.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        {feature.enabled ? (
                          <FaCheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        ) : (
                          <FaTimesCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        )}
                        <span
                          className={`
                            text-sm leading-tight
                            ${feature.enabled ? "text-gray-800" : "text-gray-400"}
                          `}
                        >
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </label>
            </div>
          ))}
        </div>
        {error && touched && (
          <p className="text-rose-500 text-sm font-medium">{error}</p>
        )}
      </div>
    )}
  </Field>
);

export default SubscriptionGroupRadio;