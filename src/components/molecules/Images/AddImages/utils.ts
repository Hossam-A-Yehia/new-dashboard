import { nanoid } from "nanoid";
import * as Yup from "yup";

export const initialValues = {
  images: [{ title: "", alt: "", caption: "", image: null, id: nanoid() }],
};

export const validationSchema = Yup.object({
  image: Yup.mixed()
    .test("fileSize", "File size is too large ( max 2000KB )", (value) => {
      const maxSize = 2000 * 1024;
      return value && value instanceof File && value.size < maxSize;
    })
    .required("Image is required"),
});
