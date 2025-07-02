import AttributesFieldArray from '@/components/molecules/AttributesFieldArray/AttributesFieldArray';
import FormField from '@/components/molecules/FormField/FormField';
import ImagesFieldArray from '@/components/molecules/ImagesFieldArray/ImagesFieldArray';
import SelectInput from '@/components/molecules/SelectInput/SelectInput';
import { attributeDataTypes } from '@/constants/attributes';
import { DialogContent } from '@mui/material';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';

interface VariantFormProps {
  isMutatePutLoading: boolean;
  setModal: (value: boolean) => void;
  isEdit: boolean;
  services: any;
  branches: any;
}

function VariantForm({ isMutatePutLoading, isEdit, branches, services }: VariantFormProps) {
  const { values, errors, touched, setFieldValue, setFieldTouched } = useFormikContext<any>();
  const { t } = useTranslation();
  const updatedAttributeDataTypes = services?.[0]?.service?.attributes?.reduce(
    (result: any[], item: { data_type: string; types: number[]; }) => {
      const matchingObject = attributeDataTypes.find(
        (obj) => obj.value === item.data_type && item.types?.includes(3)
      );

      if (matchingObject) {
        const updatedItem = {
          ...item,
          ...matchingObject,
        };
        result.push(updatedItem);
      }

      return result;
    },
    []
  );
  return (
    <DialogContent className="flex flex-col gap-5">
      <div className="bg-blue-50 text-sm text-blue-800 px-4 py-2 rounded-md text-center">
        <strong>{t('Note')}:</strong>
        {t(
          'To display this product in the application, it must have at least one variant. Use the Add Variant button to create variants for this product',
        )}
      </div>
      <div
        className={"grid grid-cols-1 md:grid-cols-3 gap-4"}
      >
        <FormField
          id="price"
          name="price"
          label={t('variants.price')}
          type="text"
          value={values.price || ''}
          placeholder={t('variants.pricePlaceholder')}
          onBlur={() => setFieldTouched('price', true)}
          touched={!!touched.price}
          errors={errors.price ? t(errors.price as string) : undefined}
          required
        />
        <FormField
          id="quantity"
          name="quantity"
          label={t('variants.quantity')}
          type="text"
          value={values.quantity || ''}
          placeholder={t('variants.quantityPlaceholder')}
          onBlur={() => setFieldTouched('quantity', true)}
          touched={!!touched.quantity}
          errors={errors.quantity ? t(errors.quantity as string) : undefined}
          required
        />
        <SelectInput
          id="branch_id"
          name="branch_id"
          label={t('variants.branch')}
          value={values.branch_id || null}
          options={branches?.map((row: { branch_name: any; id: any }) => ({
            ...row,
            label: row.branch_name,
            value: row.id,
          }))}
          onChange={(option: { value: number }) => {
            setFieldValue('branch_id', option);
          }}
          placeholder={t('variants.branchPlaceholder')}
          touched={!!touched.branch_id}
          error={errors.branch_id as string}
          isDisabled={isMutatePutLoading || isEdit}
          additionalClasses='mt-3'
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AttributesFieldArray
          form={{ values, errors, touched, setFieldValue, setFieldTouched }}
          isMutatePutLoading={isMutatePutLoading}
          attributes={updatedAttributeDataTypes}
        />
      </div>
        {!isEdit && (
          <ImagesFieldArray
            form={{
              values,
              errors,
              touched,
              setFieldValue,
              setFieldTouched,
              isSubmitting: isMutatePutLoading,
            }}
          />
        )}
    </DialogContent>
  );
}

export default VariantForm;
