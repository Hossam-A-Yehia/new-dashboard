import { ValuesOptionType } from "./Ideas";

export interface FormFieldProps {
  id: string;
  label?: string;
  type?: React.HTMLInputTypeAttribute;
  required?: boolean;
  placeholder: string;
  name: string;
  errors: string | undefined;
  touched: boolean | undefined;
  readOnly?: boolean;
  onClick?: () => void;
  value?: string;
  disabled?: boolean;
  dataTestid?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  additionalClasses?:string
}

export interface OptionType {
  value: string | number;
  label: string;
  services?: any;
}

export interface SelectInputProps {
  id: string;
  name: string;
  label: string;
  options: OptionType[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  touched?: boolean;
  disabled?: boolean;
  value?: OptionType | OptionType[] | number | null | string;
  loading?: boolean;
  targetID?: boolean;
  dataTestid?: string;
  onChange?: any;
  isDisabled?: boolean;
  additionalClasses?: string;
}

export type ClickableTextProps = {
  text: string;
  onClick: () => void;
  isActive: boolean;
};

export type SharedTitleProps = {
  text: string;
  className?: string;
};

export interface SliderItemProps {
  imageUrl: string;
  altText: string;
}

interface Feature {
  text: string;
  included: boolean;
}

export interface SubscriptionProps {
  title: string;
  price: string | number;
  description: string;
  features: Feature[];
  highlighted?: boolean;
}

export interface OptionCheckbox {
  id?: any;
  [key: `name_${string}`]: string | undefined;
  label?: string;
  value?: number;
}

export interface CheckboxGroupProps {
  title: string;
  options: OptionCheckbox[];
  selectedOptions?: number[];
  onChange: (selectedIds: number[]) => void;
  opened?: boolean;
  attributes?: boolean;
  isLoading?: boolean;
  isCity?: boolean;
}


export interface CheckboxGroupProps {
  title: string;
  options: OptionCheckbox[];
  selectedOptions?: number[];
  onChange: (selectedIds: number[]) => void;
  opened?: boolean;
  attributes?: boolean;
  isLoading?: boolean;
  isCity?: boolean;
}

export interface CheckboxGroupValuesProps {
  title: string;
  options: ValuesOptionType[];
  selectedOptions: ValuesOptionType[];
  onChange: (selected: ValuesOptionType[]) => void;
}

export interface PaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}
