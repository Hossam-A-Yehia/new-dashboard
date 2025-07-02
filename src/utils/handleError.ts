import axios from "axios";
import { t } from "i18next";

export const handleError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || t("error.error_occurred");
  } else {
    return (error as Error).message || t("error.unknown_error_occurred");
  }
};
