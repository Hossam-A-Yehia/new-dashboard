import React, { useState } from "react";
import Button from "@/components/atoms/Button/Button";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useMutateAddReply } from "@/hooks/rfqs";
import { validateFile } from "@/utils/validateFile";
import { useTranslation } from "react-i18next";
import FormField from "../FormField/FormField";
import { MAX_FILE_SIZE } from "@/constants/Constants";
import FileUploadSection from "../FileUpload/FileUploadSection";

interface FileWithError {
  file: File;
  error?: string;
}

interface ModalContentProps {
  onCancel: () => void;
  invitableId: number;
}

const ReplyInvitationModalContent: React.FC<ModalContentProps> = ({
  onCancel,
  invitableId,
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending: isSubmitting } = useMutateAddReply();
  const [uploadedFiles, setUploadedFiles] = useState<FileWithError[]>([]);

  const validationSchema = Yup.object().shape({
    details: Yup.string().required(t("invitation_details.validation.details")),
    budget: Yup.number()
      .typeError(t("invitation_details.validation.budget_must_number"))
      .required(t("invitation_details.validation.budget_required")),
    files: Yup.array()
      .of(
        Yup.mixed<File>()
          .nullable()
          .test(
            "fileSize",
            t("invitation_details.validation.size_file"),
            (file) => (file ? file.size <= MAX_FILE_SIZE : true)
          )
      )
      .min(1, t("invitation_details.validation.size_file"))
      .max(5, t("invitation_details.validation.size_file")),
  });

  return (
    <div
      className="p-8 space-y-6 bg-white rounded-lg shadow-lg max-w-lg mx-auto transition-transform transform hover:scale-105"
      data-testid="reply-invitation-modal-content"
    >
      <Formik
        initialValues={{ budget: "", details: "", files: [] }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          try {
            const formData = new FormData();
            formData.append("details", values.details);
            formData.append("discussionable_id", String(invitableId));
            formData.append("discussionable_type", "1");
            formData.append("budget", values.budget);
            values.files.forEach((file) => formData.append("files", file));
            await mutateAsync(formData);
            queryClient.invalidateQueries({ queryKey: ["invitations"] });
            toast.success(t("invitation_details.success_reply_message"));
            onCancel();
          } catch (err: any) {
            toast.error(
              err.message || t("An error occurred. Please try again.")
            );
          }
        }}
      >
        {({ touched, errors, values, setFieldValue }) => {
          const handleFileChange = (
            event: React.ChangeEvent<HTMLInputElement>
          ) => {
            const files = event.target.files;
            if (!files?.length) return;
            const newFiles: FileWithError[] = Array.from(files).map((file) => ({
              file,
              error: validateFile(file),
            }));
            setUploadedFiles((prev) => [...prev, ...newFiles]);
            const validFiles = [...uploadedFiles, ...newFiles]
              .filter((f) => !f.error)
              .map((f) => f.file);
            setFieldValue("files", validFiles);
            event.target.value = "";
          };
          const removeFile = (index: number) => {
            setUploadedFiles((prev) => {
              const newFiles = [...prev];
              newFiles.splice(index, 1);
              const validFiles = newFiles
                .filter((f) => !f.error)
                .map((f) => f.file);
              setFieldValue("files", validFiles);
              return newFiles;
            });
          };

          return (
            <Form>
              <div className="flex flex-col gap-4">
                <FormField
                  id="details"
                  label={t("invitation_details.details")}
                  type="text"
                  name="details"
                  placeholder={t("invitation_details.details_placeholder")}
                  touched={touched.details}
                  errors={errors.details}
                  value={values.details}
                  dataTestid="details-reply"
                />
                <FormField
                  id="budget"
                  label={t("invitation_details.budget")}
                  type="number"
                  name="budget"
                  placeholder={t("invitation_details.budget_placeholder")}
                  touched={touched.budget}
                  errors={errors.budget}
                  value={values.budget}
                  dataTestid="budget-reply"
                />
              </div>
              <div className="mt-3">
                <FileUploadSection
                  uploadedFiles={uploadedFiles}
                  handleFileChange={handleFileChange}
                  removeFile={removeFile}
                />
              </div>
              <div className="flex justify-around space-x-4 mt-6">
                <Button
                  variant="secondary"
                  onClick={onCancel}
                  dataTestid="cancel-button-reply"
                  type="button"
                >
                  {t("invitation_details.cancel")}
                </Button>
                <Button
                  dataTestid="confirm-button-reply"
                  variant="main"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {t("invitation_details.sent_reply")}
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default ReplyInvitationModalContent;
