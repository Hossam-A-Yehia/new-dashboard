import { nanoid } from "nanoid";
import * as Yup from "yup";

export const initialValues = (user: { id: any; user: { username: any; id: any; }; }) => ({
  title_en: "",
  title_ar: "",
  short_des_en: "",
  short_des_ar: "",
  rich_des_en: "",
  rich_des_ar: "",
  user_id: user?.id ? { label: user.user.username, value: user.user.id } : "",
  user_service_id: "",
  images: [{ title: "", alt: "", caption: "", image: null, id: nanoid() }],
});

export const editInitialValues = (selectedRow: { title_en: any; title_ar: any; short_des_en: any; short_des_ar: any; rich_des_en: any; rich_des_ar: any; user: { username: any; id: any; }; service: { name_en: any; id: any; }; values: any[]; }) => ({
  title_en: selectedRow.title_en,
  title_ar: selectedRow.title_ar,
  short_des_en: selectedRow.short_des_en,
  short_des_ar: selectedRow.short_des_ar,
  rich_des_en: selectedRow.rich_des_en,
  rich_des_ar: selectedRow.rich_des_ar,
  user_id: { label: selectedRow.user.username, value: selectedRow.user.id },
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

  short_des_en: Yup.string()
    .trim()
    .min(10, "Short description must be at least 10 characters")
    .max(300, "Short description cannot exceed 300 characters")
    .required("Please enter the short description in English"),
  user_id: Yup.object().required("Please Enter User"),
  user_service_id: Yup.object().required("This faild is required"),

  images: Yup.array().of(
    Yup.object().shape({
      title: Yup.string()
        .trim()
        .min(3, "title must be at least 3 characters")
        .required("Please enter the title"),
      image: Yup.mixed()
        .test("fileSize", "File size is too large ( max 2000KB )", (value) => {
          const maxSize = 2000 * 1024;
          if (!value) return false;
          if (typeof value === "object" && value !== null && "size" in value) {
            return (value as File).size < maxSize;
          }
          return false;
        })
        .required("Image is required"),
    })
  ),
});

export const validationBulkSchema = Yup.object({
  file: Yup.mixed()
    .test("fileSize", "File size is too large (max 2000KB)", (value) => {
      if (!value) {
        return true;
      }
      const maxSize = 2000 * 1024;
      if (value && typeof value === "object" && "size" in value) {
        return (value as File).size <= maxSize;
      }
      return false;
    })
    .required("File is required"),
});

export const initialBulkValues = {
  user_id: "",
  file: "",
};
