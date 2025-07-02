import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { useMutateAddImage, useMutateEditImage } from '@/hooks/image';
import { toast } from 'react-toastify';
import { Formik } from 'formik';
import { initialValues, validationSchema } from './utils';
import ImagesForm from './ImagesForm';

interface AddImageProps {
  setModal: (open: boolean) => void;
  toggle: () => void;
  imageable_id: string | number;
  imageable_type: string;
  selectedRow: any;
  isEdit: boolean;
}

export const AddImage: React.FC<AddImageProps> = ({ setModal,imageable_id,imageable_type,isEdit }) => {
    const queryClient = useQueryClient();

  const {
    mutateAsync,
    isPending: isMutatePutLoading,
  } = (isEdit ? useMutateEditImage : useMutateAddImage)();

    const handleSubmit = async (values:any, { resetForm, setErrors }:any) => {
    const structuredData = {
      title: values.title,
      alt: values.alt,
      caption: values.caption,
      image: values.image,
      imageable_id: imageable_id,
      imageable_type: imageable_type,
    };

    const formData = new FormData();

    (Object.keys(structuredData) as Array<keyof typeof structuredData>).forEach((key) => {
      const value = structuredData[key];
      formData.append(key.toString(), value as string | Blob);
    });

    mutateAsync(formData)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["images"] });
        toast.info(t("commonImageCard.message.imageUpdatedSuccessfully"));
        resetForm();
      })
      .catch((err) => {
        if (err?.response?.data?.errors) {
          setErrors(err?.response?.data?.errors);
        } else {
          toast.error(t(err.response.data.message));
        }
        return err;
      });
  };

  
  const { t } = useTranslation();
  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(form) => (
          <ImagesForm
            setModal={setModal}
            form={form}
            isMutatePutLoading={isMutatePutLoading}
          />
        )}
      </Formik>
    </>
  );
};

export default AddImage;