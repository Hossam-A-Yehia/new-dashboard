import { nanoid } from "nanoid";
import * as Yup from "yup";

export const initialValues = () => ({
  title_ar: "",
  description_ar: "",
  title_en: "",
  description_en: "",
  user_service_id: "",
  images: [{ title: "", alt: "", caption: "", image: null, id: nanoid() }],
  values: [{ attribute_id: null, value: "" }],
});

export const editInitialValues = (selectedRow: { title_ar: any; description_ar: any; title_en: any; description_en: any; service: { name_en: any; id: any; }; values: any[]; }) => ({
  title_ar: selectedRow.title_ar,
  description_ar: selectedRow.description_ar,
  title_en: selectedRow.title_en,
  description_en: selectedRow.description_en,
  user_service_id: {
    label: selectedRow.service.name_en,
    value: selectedRow.service.id,
  },
  attributes: selectedRow.values.map((el) => {
    if (
      el.attribute.data_type === "TEXT" ||
      el.attribute.data_type === "TEXT_AREA"
    ) {
      try {
        const parsedValue = JSON.parse(el.value);
        return {
          attribute_id: el.attribute.id,
          en: parsedValue.en,
          ar: parsedValue.ar,
          values: el.attribute.values,
          name_en: el.attribute.name_en,
          name_ar: el.attribute.name_ar,
          data_type: el.attribute.data_type,
          id: el.id,
          attribute_type: el.attribute.attribute_type,
        };
      } catch (error) {
        console.log(error);
        
        return {
          attribute_id: el.attribute.id,
          value: el.value,
          values: el.attribute.values,
          name_en: el.attribute.name_en,
          name_ar: el.attribute.name_ar,
          data_type: el.attribute.data_type,
          id: el.id,
          attribute_type: el.attribute.attribute_type,
        };
      }
    }

    return {
      attribute_id: el.attribute.id,
      value: el.value,
      values: el.attribute.values,
      name_en: el.attribute.name_en,
      name_ar: el.attribute.name_ar,
      data_type: el.attribute.data_type,
      id: el.id,
      attribute_type: el.attribute.attribute_type,
    };
  }),
});
export const validationSchema = Yup.object({
  title_en: Yup.string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters")
    .required("Please enter the title in English"),
  description_en: Yup.string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(300, "Description cannot exceed 300 characters")
    .required("Please enter the description in English"),
  title_ar: Yup.string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters")
    .optional(),
  description_ar: Yup.string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(300, "Description cannot exceed 300 characters")
    .optional(),
  user_service_id: Yup.object().required("Please Enter Service"),
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
