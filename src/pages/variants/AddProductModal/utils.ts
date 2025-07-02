import { nanoid } from "nanoid";
import * as Yup from "yup";

export const initialValues = {
  price: "",
  quantity: "",
  branch_id: "",
  product_id: "",
  images: [{ title: "", alt: "", caption: "", image: null, id: nanoid() }],
  values: [{ attribute_id: null, value: "" }],
};

export const editInitialValues = (selectedRow: { price: any; quantity: any; product_id: any; branch: { branch_name: any; id: any; }; attributes: { value: { value: string; attribute: any[]; id: any; }; data_type: string; id: any; name_en: any; name_ar: any; attribute_type: any; values: any; }[]; }) => ({
  price: selectedRow.price,
  quantity: selectedRow.quantity,
  product_id: selectedRow.product_id,
  branch_id: {
    label: selectedRow.branch.branch_name,
    value: selectedRow.branch.id,
  },
  attributes: selectedRow.attributes?.map((el: { value: { value: string; attribute: any[]; id: any; }; data_type: string; id: any; name_en: any; name_ar: any; attribute_type: any; values: any; }) => {
    // Handle TEXT and TEXT_AREA data types
    if (el.value && (el.data_type === "TEXT" || el.data_type === "TEXT_AREA")) {
      try {
        const parsedValue = JSON.parse(el.value.value);
        return {
          attribute_id: el.id, // Attribute ID from the variant's attribute
          en: parsedValue.en, // Parsed English value
          ar: parsedValue.ar, // Parsed Arabic value
          values: el.value.attribute?.values, // Possible values for the attribute, if any
          name_en: el.name_en, // Attribute name in English
          name_ar: el.name_ar, // Attribute name in Arabic
          data_type: el.data_type, // Data type (e.g., TEXT, TEXT_AREA)
          id: el.value.id, // ID of the specific value object
          attribute_type: el.attribute_type, // Attribute type if present
        };
      } catch (error) {
        console.error("Parsing error:", error);
        return {
          attribute_id: el.id, // Attribute ID
          value: el.value.value, // Raw value in case parsing fails
          values: el.value.attribute?.values, // Possible values for the attribute
          name_en: el.name_en, // Attribute name in English
          name_ar: el.name_ar, // Attribute name in Arabic
          data_type: el.data_type, // Data type (e.g., TEXT, TEXT_AREA)
          id: el.value.id, // ID of the specific value object
          attribute_type: el.attribute_type, // Attribute type if present
        };
      }
    }

    // Handle other data types (e.g., SELECT_BOX, etc.)
    return {
      attribute_id: el.id, // Attribute ID
      value: el.value ? el.value.value : null, // Handle null values gracefully
      values: el.values, // Possible values for the attribute
      name_en: el.name_en, // Attribute name in English
      name_ar: el.name_ar, // Attribute name in Arabic
      data_type: el.data_type, // Data type (e.g., SELECT_BOX, etc.)
      id: el.value ? el.value.id : null, // ID of the specific value object, if available
      attribute_type: el.attribute_type, // Attribute type if present
    };
  }),
});


export const validationSchema = (selectedRow: { id: any; }) => {
  return Yup.object({
    price: Yup.string().required("Please Enter Price"),
    quantity: Yup.string().required("Please Enter Quantity"),
    branch_id: Yup.object().required("Please Select a branch"),
    images: Yup.array().of(
      Yup.object().shape({
        title: Yup.string()
          .trim()
          .min(3, "Title must be at least 3 characters")
          .required("Please enter the title"),
        image: Yup.mixed()
          .test("fileSize", "File size is too large (max 2000KB)", (value) => {
            if (!value) return false;
            const maxSize = 2000 * 1024;
            if (value instanceof File || value instanceof Blob) {
              return value.size < maxSize;
            }
            return false;
          })
          .required("Image is required"),
      })
    ),
    attributes: Yup.array().of(
      Yup.object().shape({
        attribute_id: Yup.number().when([], {
          is: () => !selectedRow.id, // When `selectedRow` is false, require it
          then: (schema) => schema.required("Attribute ID is required"),
          otherwise: (schema) => schema.notRequired(),
        }),
        value: Yup.string().when([], {
          is: () => !selectedRow.id, // When `selectedRow` is false, require it
          then: (schema) => schema.required("Value is required"),
          otherwise: (schema) => schema.notRequired(),
        }),
      })
    ),
  });
};
