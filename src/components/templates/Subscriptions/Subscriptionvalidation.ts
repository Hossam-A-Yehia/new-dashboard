import * as Yup from "yup";
export const PackagesValidation = Yup.object().shape({
  package_id: Yup.number().required(),
});
