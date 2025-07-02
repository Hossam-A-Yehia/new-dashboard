import Button from '@/components/atoms/Button/Button';
import { CircularProgress, Dialog, DialogActions, DialogTitle } from '@mui/material';
import { Form, Formik } from 'formik';
import { editInitialValues, initialValues, validationSchema } from './utils';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { Edit, Plus } from 'lucide-react';
import { useMutateAddIdea, useMutateEditIdea } from '@/hooks/useIdeas';
import IdeaForm from './IdeaForm';
import { useParams } from 'react-router-dom';

interface AddIdeaModalProps {
  setModal: (value: boolean) => void;
  toggle: boolean;
  isEdit: boolean;
  selectedRow?: any;
}

function AddIdeaModal({ setModal, toggle, isEdit, selectedRow }: AddIdeaModalProps) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { id } = useParams();

  const { mutateAsync, isPending: isMutateLoading } = (
    isEdit ? useMutateEditIdea : useMutateAddIdea
  )();

  const handleSubmit = async (
    values: any,
    { resetForm, setErrors }: { resetForm: () => void; setErrors: (errors: any) => void },
  ) => {
    if (isEdit) {
      const structuredData: Record<string, any> = {
        title_ar: values.title_ar,
        description_ar: values.description_ar,
        title_en: values.title_en,
        description_en: values.description_en,
        values: values.attributes.map(
          (att: { isMulti: any; id: any; en: any; ar: any; value: any }) => {
            if (att.isMulti) {
              return {
                id: att.id,
                value: JSON.stringify({ en: att.en, ar: att.ar }),
              };
            }
            return {
              id: att.id,
              value: att.value,
            };
          },
        ),
      };

      const initialValues: Record<string, any> = editInitialValues(selectedRow);
      const changedFields: Record<string, any> = {};

      for (const key in structuredData) {
        if (
          Object.prototype.hasOwnProperty.call(structuredData, key) &&
          structuredData[key] !== initialValues[key]
        ) {
          changedFields[key] = structuredData[key];
        }
      }
      mutateAsync({ data: changedFields, id: selectedRow.id })
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ['ideas'] });
          toast.info('Idea Updated Successfully!');
          setModal(false);
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
    } else {
      const structuredData = {
        user_project_id: id,
        user_service_id: values.user_service_id?.value,
        title_ar: values.title_ar,
        description_ar: values.description_ar,
        title_en: values.title_en,
        description_en: values.description_en,
        images: values.images.map((image: { title: any; alt: any; caption: any; image: any }) => ({
          title: image.title,
          alt: image.alt,
          caption: image.caption,
          image: image.image,
        })),
        values: values.attributes.map(
          (att: { isMulti: any; attribute_id: any; en: any; ar: any; value: any }) => {
            if (att.isMulti) {
              return {
                attribute_id: att.attribute_id,
                value: JSON.stringify({ en: att.en, ar: att.ar }),
              };
            }
            return {
              attribute_id: att.attribute_id,
              value: att.value,
            };
          },
        ),
      };
      const formData = new FormData();
      Object.keys(structuredData).forEach((key) => {
        const value = structuredData[key as keyof typeof structuredData];
        if (key === 'images') {
          value.forEach((image: { [x: string]: string | Blob }, index: any) => {
            const imageKeys = Object.keys(image);
            imageKeys.forEach((imageKey) => {
              formData.append(`images[${index}][${imageKey}]`, image[imageKey]);
            });
          });
        } else if (key === 'values') {
          value.forEach((attribute: { [x: string]: string | Blob }, index: any) => {
            const attributeKeys = Object.keys(attribute);
            attributeKeys.forEach((attributeKey) => {
              formData.append(`values[${index}][${attributeKey}]`, attribute[attributeKey]);
            });
          });
        } else {
          formData.append(key, value);
        }
      });

      mutateAsync(formData)
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ['ideas'] });
          toast.info('Idea Created Successfully!');
          setModal(false);
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
    }
  };

  return (
    <Dialog open={toggle} onClose={() => setModal(false)} fullWidth maxWidth="md">
      <DialogTitle className="text-main">{isEdit ? t('Edit') : t('Add New')}</DialogTitle>
      <Formik
        initialValues={isEdit && selectedRow ? editInitialValues(selectedRow) : initialValues()}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <IdeaForm isMutatePutLoading={isMutateLoading} isEdit={isEdit} />
            <DialogActions>
              <div>
                <Button onClick={() => setModal(false)} variant="secondary">
                  {t('Cancel')}
                </Button>
              </div>
              <div>
                <Button type="submit" variant="main" disabled={isMutateLoading}>
                  {isMutateLoading ? (
                    <CircularProgress size={20} className="mr-2" />
                  ) : isEdit ? (
                    <Edit size={15} className="mr-2" />
                  ) : (
                    <Plus size={15} className="mr-2" />
                  )}
                  {isEdit ? t('Update') : t('Save')}
                </Button>
              </div>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}

export default AddIdeaModal;
