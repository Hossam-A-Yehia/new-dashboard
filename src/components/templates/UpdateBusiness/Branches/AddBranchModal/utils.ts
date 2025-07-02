import { t } from 'i18next';
import * as Yup from 'yup';
export interface BranchFormValues {
  branchName: string;
  phone: string;
  city: string;
  country: string;
  postCode: string;
  email: string;
  lat: number;
  lang: number;
}

export const initialValues: BranchFormValues = {
  branchName: '',
  phone: '',
  city: '',
  country: '',
  postCode: '',
  email: '',
  lang: 0,
  lat: 0,
};

export const getValidationSchema = () =>
  Yup.object({
    branchName: Yup.string()
      .trim()
      .min(3, t('add_branch.validation.branchNameCharacters'))
      .required(t('add_address.validation.address_title')),
    phone: Yup.string()
      .matches(/^\+?[0-9]{8,15}$/, t('auth.register.invalid_phone'))
      .required(t('auth.register.invalid_phone')),
    city: Yup.string().required(t('add_address.validation.city')),
    country: Yup.string().required(t('add_address.validation.country')),
    postCode: Yup.string()
      .matches(/^\d+$/, t('add_branch.validation.postcode_numeric'))
      .min(2, t('add_branch.validation.postcode_min'))
      .optional(),
    email: Yup.string()
      .email(t('edit_user.validation.invalid_email'))
      .matches(/^[\w.-]+@[\w.-]+\.\w+$/, t('edit_user.validation.invalid_email_format'))
      .required(t('edit_user.validation.email_required')),
    lat: Yup.string().required(t('add_branch.validation.choose_location')),
    lang: Yup.string().required(t('add_branch.validation.choose_location')),
  });
