import Loader from "@/components/atoms/Loader/Loader";
import { useLanguage } from "@/hooks/useLanguage";
import { ValuesOptionType } from "@/types/Ideas";
import {
  CheckboxGroupProps,
  CheckboxGroupValuesProps,
} from "@/types/Molecules";
import React, { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { FaExclamationCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import NoData from "../NoDate/NoDate";

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  title,
  options,
  selectedOptions = [],
  onChange,
  opened = false,
  isLoading,
  isCity,
}) => {
  const [isOpen, setIsOpen] = useState(opened);
  const lang = useLanguage();
  const { t } = useTranslation();
  const handleChange = (id: number) => {
    const updatedSelectedIds = selectedOptions.includes(id)
      ? selectedOptions.filter((selectedId) => selectedId !== id)
      : [...selectedOptions, id];
    onChange(updatedSelectedIds);
  };
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div
        className="cursor-pointer font-bold flex justify-between items-center text-gray-800"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        {isOpen ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
      </div>
      {isLoading && <Loader />}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {!isLoading && (
          <div
            className={`mt-2 border-t border-gray-200 pt-3 ${
              options?.length > 13 ? "overflow-y-scroll" : ""
            } max-h-[500px]`}
          >
            {options?.length > 0 ? (
              options?.map((option, index) => {
                const id = `option-${option.id}`;
                return (
                  <div
                    key={index}
                    className="flex items-center py-2 hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      id={id}
                      value={option.name_en}
                      checked={selectedOptions.includes(option.id)}
                      onChange={() => handleChange(option.id)}
                      className="h-4 w-4 border-gray-300 rounded accent-main"
                    />
                    <label className="mr-2 ltr:ml-2 text-gray-700 text-sm">
                      {option[`name_${lang}`] || option.name_en || option.label}
                    </label>
                  </div>
                );
              })
            ) : (
              <>
                {isCity ? (
                  <div className="flex items-center text-red-500 space-x-2 my-3">
                    <FaExclamationCircle className="text-xl" />
                    <div className="text-sm font-semibold">
                      {t("choose_country_first")}
                    </div>
                  </div>
                ) : (
                  <NoData />
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const CheckboxGroupForValues: React.FC<CheckboxGroupValuesProps> = ({
  title,
  options,
  selectedOptions = [],
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const lang = useLanguage();

  const handleChange = (option: ValuesOptionType) => {
    const exists = selectedOptions.some(
      (selectedOption) =>
        selectedOption.name_en === option.name_en &&
        selectedOption.attributesId === option.attributesId
    );

    const updatedSelectedOptions = exists
      ? selectedOptions.filter(
          (selectedOption) =>
            !(
              selectedOption.name_en === option.name_en &&
              selectedOption.attributesId === option.attributesId
            )
        )
      : [...selectedOptions, option];

    onChange(updatedSelectedOptions);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div
        className="cursor-pointer font-bold flex justify-between items-center text-gray-800"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        {isOpen ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mt-2 border-t border-gray-200 pt-3">
          {options?.map((option, index) => (
            <div
              key={index}
              className="flex items-center py-2 hover:bg-gray-50 transition-colors"
            >
              <input
                id={`checkbox-${index}`}
                type="checkbox"
                value={option.name_en}
                checked={selectedOptions.some(
                  (selected) =>
                    selected.name_en === option.name_en &&
                    selected.attributesId === option.attributesId
                )}
                onChange={() => handleChange(option)}
                className="h-4 w-4  border-gray-300 rounded accent-main"
              />

              <label
                htmlFor={`checkbox-${index}`}
                className="mr-2 ltr:ml-2 text-gray-700 text-sm"
              >
                {option[`name_${lang}`] || option.name_en}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { CheckboxGroup, CheckboxGroupForValues };
