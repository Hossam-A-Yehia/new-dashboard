import Button from '@/components/atoms/Button/Button';
import { CircularProgress, Dialog, DialogActions, DialogTitle } from '@mui/material';
import { Form, Formik } from 'formik';
import { editInitialValues, initialValues } from './utils';
import { useUser } from '@/context/UserContext';
import { useTranslation } from 'react-i18next';
import {
  ADMIN_TYPE,
  SERVICE_PROVIDER_CONTRACTOR,
  SERVICE_PROVIDER_FIRM,
  SERVICE_PROVIDER_FREELANCE,
} from '@/constants/Constants';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { useDebounce } from 'react-use';
import { useState } from 'react';
import { useFetchBusinessUsers } from '@/hooks/useUser';
import { Edit, Plus } from 'lucide-react';
import ProjectForm from './ProductForm';
import { useMutateAddProduct, useMutateEditProduct } from '@/hooks/useProducts';

interface AddProductModalProps {
  setModal: (value: boolean) => void;
  toggle: boolean;
  isEdit: boolean;
  selectedRow?: any;
}

function AddProductModal({ setModal, toggle, isEdit, selectedRow }: AddProductModalProps) {
  const queryClient = useQueryClient();
  const { userData } = useUser();
  const { t } = useTranslation();

  const { mutateAsync, isPending: isMutateLoading } = (
    isEdit ? useMutateEditProduct : useMutateAddProduct
  )();

  const [filteredName, setFilteredName] = useState('');
  const [inputSelectValue, setInputSelectValue] = useState('');

  const isNotAdmin = !ADMIN_TYPE.includes(userData?.user_type);
  const notAdminUser = isNotAdmin
    ? {
        id: userData?.id,
        user: {
          username: userData?.username,
          id: userData?.id,
        },
      }
    : null;

  useDebounce(() => setFilteredName(inputSelectValue), 500, [inputSelectValue]);

  const { data, isLoading: isUsersLoading } = useFetchBusinessUsers({
    username: filteredName,
    userTypes: [SERVICE_PROVIDER_FREELANCE, SERVICE_PROVIDER_FIRM, SERVICE_PROVIDER_CONTRACTOR],
  });

  const businessUsers = data?.data.payload.data || [];

  const handleSubmit = async (values:any, { resetForm, setErrors }:any) => {    
    if (isEdit) {
      const structuredData: { [key: string]: any } = {
        title_en: values.title_en,
        title_ar: values.title_ar,
        short_des_en: values.short_des_en,
        short_des_ar: values.short_des_ar,
        rich_des_en: values.rich_des_en,
        rich_des_ar: values.rich_des_ar,
        values: values.attributes.map((att: { isMulti: any; id: any; en: any; ar: any; value: any; }) => {
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
        }),
      };

      const initialValues = editInitialValues(selectedRow) as { [key: string]: any };
      const changedFields: { [key: string]: any } = {};

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
          queryClient.invalidateQueries({ queryKey: ["products"] });
          toast.info(t("addProduct.message.updateSuccessfully"));
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
      type StructuredData = {
        user_id: any;
        user_service_id: any;
        title_en: any;
        title_ar: any;
        short_des_en: any;
        short_des_ar: any;
        rich_des_en: any;
        rich_des_ar: any;
        images: any;
        values: any;
      };

      const structuredData: StructuredData = {
        user_id: values.user_id?.value,
        user_service_id: values.user_service_id?.value,
        title_en: values.title_en,
        title_ar: values.title_ar,
        short_des_en: values.short_des_en,
        short_des_ar: values.short_des_ar,
        rich_des_en: values.rich_des_en,
        rich_des_ar: values.rich_des_ar,
        images: values.images.map((image: { title: any; alt: any; caption: any; image: any; }) => ({
          title: image.title,
          alt: image.alt,
          caption: image.caption,
          image: image.image,
        })),
        values: values.attributes.map((att: { isMulti: any; attribute_id: any; en: any; ar: any; value: any; }) => {
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
        }),
      };

      const formData = new FormData();

      (Object.keys(structuredData) as (keyof StructuredData)[]).forEach((key) => {
        const value = structuredData[key];
        if (key === "images") {
          // Handle images array separately
          value.forEach((image: { [x: string]: string | Blob; }, index: any) => {
            const imageKeys = Object.keys(image);
            imageKeys.forEach((imageKey) => {
              formData.append(`images[${index}][${imageKey}]`, image[imageKey]);
            });
          });
        } else if (key === "values") {
          // Handle "values" array separately (if needed)
          value.forEach((attribute: { [x: string]: string | Blob; }, index: any) => {
            const attributeKeys = Object.keys(attribute);
            attributeKeys.forEach((attributeKey) => {
              formData.append(
                `values[${index}][${attributeKey}]`,
                attribute[attributeKey]
              );
            });
          });
        } else {
          formData.append(key, value);
        }
      });

      mutateAsync(formData)
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["products"] });
          toast.info(t("addProduct.message.createdSuccessfully"));
          resetForm();
          setModal(false)
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
      <DialogTitle className="text-main">{isEdit ? t('addProduct.editProduct') : t('addProduct.addNewProduct')}</DialogTitle>
      <Formik
        initialValues={
          isEdit && selectedRow
            ? editInitialValues(selectedRow)
            : initialValues(notAdminUser || userData)
        }
        onSubmit={handleSubmit}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <ProjectForm
              setInputSelectValue={setInputSelectValue}
              businessUsers={businessUsers}
              isUsersLoading={isUsersLoading}
              isMutatePutLoading={isMutateLoading}
              setModal={setModal}
              isEdit={isEdit}
            />
            <DialogActions>
              <div>
                <Button onClick={() => setModal(false)} variant="secondary">
                  {t('addProduct.buttons.cancel')}
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
                  {isEdit ? t('addProduct.buttons.update') : t('addProduct.buttons.save')}
                </Button>
              </div>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}

export default AddProductModal;
