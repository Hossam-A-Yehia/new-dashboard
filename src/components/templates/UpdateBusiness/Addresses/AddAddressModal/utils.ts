import { t } from 'i18next';
import * as Yup from 'yup';



export interface AddressFormValues {
  addressTitle: string;
  streetAddress: string;
  phone: string;
  city: string;
  country: string;
  postCode: string;
  specialInstructions: string;
  email: string;
  lat: number;
  lang: number;
}

export const initialValues: AddressFormValues = {
  addressTitle: '',
  streetAddress: '',
  phone: '',
  city: '',
  country: '',
  postCode: '',
  specialInstructions: '',
  email: '',
  lat: 0,
  lang: 0,
};

export const getValidationSchema = () =>
  Yup.object({
  addressTitle: Yup.string()
    .trim()
    .min(3, t('add_address.message.MinRequired'))
    .required(t('add_address.validation.address_title')),
  phone: Yup.string()
    .matches(/^\+?[0-9]{8,15}$/, t('auth.register.invalid_phone'))
    .required(t('auth.register.invalid_phone')),
  city: Yup.string().required(t('add_address.validation.city')),
  country: Yup.string().required(t('add_address.validation.country')),
  specialInstructions: Yup.string(),

  postCode: Yup.string()
    .matches(/^\d+$/, t('add_address.message.PostCodeNumeric'))
    .min(2, t('add_address.message.PostcodeMinRequired'))
    .optional(),
  email: Yup.string()
    .email(t('edit_user.validation.invalid_email'))
    .matches(/^[\w.-]+@[\w.-]+\.\w+$/, 'Invalid email format')
    .required(t('edit_user.validation.email_required')),
});
