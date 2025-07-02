import { CategoryNode } from "@/types/RFQs";
import * as Yup from "yup";

export const initialValues = () => ({
  category: "",
  service_id: { value: "" },
  subject: "",
  description: "",
  city_id: "",
  country_id: "",
  valid_until: "",
  files: [],
  buisness_type: "",
});
export const validationSchema = Yup.object().shape({
  buisness_type: Yup.object().required("Type is required"),
  category: Yup.object().required("Category is required"),
  service_id: Yup.object().required("Service is required"),
  subject: Yup.string().required("Subject is required"),
  city_id: Yup.string().required("Please Select a city"),
  valid_until: Yup.string().required("Please Select a city"),
});

export function getAllCategories(nodes: CategoryNode[] = []): CategoryNode[] {
  const result: CategoryNode[] = [];
  function traverse(nodes: CategoryNode[]) {
    nodes.forEach((node) => {
      if (!node.children || node.children.length === 0) {
        result.push(node);
      } else {
        traverse(node.children);
      }
    });
  }

  traverse(nodes);
  return result;
}
