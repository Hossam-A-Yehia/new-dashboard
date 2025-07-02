import Button from '@/components/atoms/Button/Button';
import { CircularProgress, Dialog, DialogActions, DialogTitle } from '@mui/material';
import { Form, Formik } from 'formik';
import { editInitialValues, initialValues } from './utils';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { useFetchUserServicesForIdea } from '@/hooks/useUser';
import { Edit, Plus } from 'lucide-react';
import { useFetchBranches } from '@/hooks/useBranches';
import { useMutateAddVariant, useMutateEditVariant } from '@/hooks/useVariants';
import VariantForm from './VariantForm';

interface AddVariantModalModalProps {
  setModal: (value: boolean) => void;
  toggle: boolean;
  isEdit: boolean;
  selectedRow?: any;
  product: any;
}

function AddVariantModal({
  setModal,
  toggle,
  isEdit,
  selectedRow,
  product,
}: AddVariantModalModalProps) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { mutateAsync, isPending: isMutateLoading } = (
    isEdit ? useMutateEditVariant : useMutateAddVariant
  )();

  const { data: branches } = useFetchBranches(product?.user.id);

  const { data: userServicesData } = useFetchUserServicesForIdea({
    userId: product?.user.id,
    serviceId: product?.service?.id,
  });
  const userServices = userServicesData?.data?.payload;

  const handleSubmit = async (values: any, { resetForm, setErrors }: any) => {
    if (isEdit) {
      const newAttributes = values?.attributes?.filter((atr: { value: any }) => atr.value) || [];
      const structuredData = {
        price: values.price,
        quantity: values.quantity,
        branch_id: values.branch_id.value,
        product_id: product.id,
        values: newAttributes?.map((att: { id: any; value: any }) => {
          return {
            id: att?.id,
            value: att?.value,
          };
        }),
      };

      const initialValues: { [key: string]: any } = editInitialValues(selectedRow);
      const changedFields: Record<string, any> = {};

      for (const key in structuredData) {
        if (
          Object.prototype.hasOwnProperty.call(structuredData, key) &&
          structuredData[key as keyof typeof structuredData] !==
            initialValues[key as keyof typeof initialValues]
        ) {
          changedFields[key] = structuredData[key as keyof typeof structuredData];
        }
      }
      mutateAsync({ data: changedFields, id: selectedRow.id })
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ['variants'] });
          toast.info(t('variants.messages.updateVariantSuccess'));
          setModal(false);
          resetForm();
        })
        .catch((err) => {
          if (err?.response?.data?.errors) {
            setErrors(err?.response?.data?.errors);
          } else {
            toast.error(t('variants.messages.somethingWentWrong'));
          }
          return err;
        });
    } else {
      type StructuredData = {
        branch_id: any;
        product_id: any;
        price: any;
        quantity: any;
        images: any;
        values: any;
      };

      const structuredData: StructuredData = {
        branch_id: values?.branch_id.id,
        product_id: product?.id,
        price: values?.price,
        quantity: values?.quantity,
        images: values?.images.map((image: { title: any; alt: any; caption: any; image: any }) => ({
          title: image?.title,
          alt: image?.alt,
          caption: image?.caption,
          image: image?.image,
        })),
        values: values?.attributes?.map(
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

      (Object.keys(structuredData) as (keyof StructuredData)[]).forEach((key) => {
        const value = structuredData[key];
        if (key === 'images') {
          value.forEach((image: { [x: string]: string | Blob }, index: any) => {
            const imageKeys = Object.keys(image);
            imageKeys.forEach((imageKey) => {
              formData.append(`images[${index}][${imageKey}]`, image[imageKey]);
            });
          });
        } else if (key === 'values') {
          value?.forEach((attribute: { [x: string]: string | Blob }, index: any) => {
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
          queryClient.invalidateQueries({ queryKey: ['products'] });
          queryClient.invalidateQueries({ queryKey: ['variants'] });
          toast.info(t('variants.messages.createVariantSuccess'));
          setModal(false);
          resetForm();
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message);
          return err;
        });
    }
  };

  return (
    <Dialog open={toggle} onClose={() => setModal(false)} fullWidth maxWidth="md">
      <DialogTitle className="text-main">
        {isEdit ? t('variants.editVariant') : t('variants.addNewVariant')}
      </DialogTitle>
      <Formik
        initialValues={isEdit ? editInitialValues(selectedRow) : initialValues}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <VariantForm
              isMutatePutLoading={isMutateLoading}
              setModal={setModal}
              isEdit={isEdit}
              branches={branches}
              services={userServices}
            />
            <DialogActions>
              <div>
                <Button onClick={() => setModal(false)} variant="secondary">
                  {t('variants.cancel')}
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
                  {isEdit ? t('variants.update') : t('variants.save')}
                </Button>
              </div>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}

export default AddVariantModal;
