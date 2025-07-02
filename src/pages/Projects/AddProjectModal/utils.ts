import { nanoid } from 'nanoid';
import * as Yup from 'yup';

export const initialValues = (user: { id: any; user: { id: any } }) => ({
  title_ar: '',
  description_ar: '',
  title_en: '',
  description_en: '',
  city_id: '',
  country_id: '',
  businessUser_id: user?.id ? user.user.id : 0,
  creation_date: '',
  images: [{ title: '', alt: '', caption: '', image: null, id: nanoid() }],
  category_id: [],
});

export const editInitialValues = (row: any) => ({
  title_ar: row?.title_ar || '',
  description_ar: row?.description_ar || '',
  title_en: row?.title_en || '',
  description_en: row?.description_en || '',
  businessUser_id: row?.businessUser_id || '',
  country_id: row?.city?.country_id || '',
  city_id: row?.city_id || '',
  creation_date: row?.creation_date || '',
  images: row?.images?.length
    ? row.images.map((img: any) => ({
        title: img.title || '',
        alt: img.alt || '',
        caption: img.caption || '',
        image: img.image || null,
        id: img.id || nanoid(),
      }))
    : [{ title: '', alt: '', caption: '', image: null, id: nanoid() }],
});

export const validationSchema = Yup.object({
  title_en: Yup.string()
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters')
    .required('Please enter the title in English'),

  description_en: Yup.string()
    .trim()
    .min(10, 'Short description must be at least 10 characters')
    .max(300, 'Short description cannot exceed 300 characters')
    .required('Please enter the short description in English'),

  country_id: Yup.string().required('Please Select a country'),
  creation_date: Yup.string().required('Please enter the creation date'),
  city_id: Yup.string().required('City is required'),
  images: Yup.array().of(
    Yup.object().shape({
      title: Yup.string()
        .trim()
        .min(3, 'Title must be at least 3 characters')
        .required('Please enter the title'),
      image: Yup.mixed()
        .nullable()
        .test('fileSize', 'File size is too large (max 2000KB)', (value) => {
          if (!value) return true;
          if (typeof value === 'string') return true;
          return value instanceof File && value.size < 2000 * 1024;
        }),
    }),
  ),
});
