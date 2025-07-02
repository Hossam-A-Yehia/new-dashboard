import { Form, Formik } from 'formik';
import Button from '@/components/atoms/Button/Button';
import { validationSchema } from './validationSchema';
import { useBusinessForm } from '@/hooks/useBusinessForm';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { t } from 'i18next';
import Loader from '@/components/atoms/Loader/Loader';
import { BusinessDetailsSection } from '@/components/organisms/BusinessDetailsSection/BusinessDetailsSection';

export default function UpdateBusinessTemplate() {
  const {
    initialValues,
    isMutatePutLoading,
    countryOptions,
    cityOptions,
    mutateAsync,
    userId,
    isLoading,
  } = useBusinessForm();
  const queryClient = useQueryClient();

  const onSubmit = async (values: any, { resetForm, setErrors }: any) => {
    const changedFields: Record<string, any> = {};
    for (const key in values) {
      if (
        Object.prototype.hasOwnProperty.call(values, key) &&
        values[key as keyof typeof initialValues] !==
          initialValues[key as keyof typeof initialValues]
      ) {
        if (
          typeof values[key] === 'object' &&
          ((values[key] as any)?.value !== (initialValues as any)[key]?.value ||
            ['logo', 'profile', 'files', 'classifications'].includes(key))
        ) {
          if (['logo', 'profile', 'files', 'classifications'].includes(key)) {
            changedFields[key] = values[key];
          } else {
            changedFields[key] = values[key].value;
          }
        } else if (typeof values[key] === 'string' || typeof values[key] === 'number') {
          changedFields[key] = values[key];
        }
      }
    }
    const hasSpecialFields = ['files', 'classifications', 'logo', 'profile'].some(
      (field) => field in changedFields,
    );

    let formData: FormData | Record<string, any>;

    if (hasSpecialFields) {
      formData = new FormData();
      formData.append('_method', 'PUT');

      for (const key in changedFields) {
        if (changedFields[key]) {
          if (key === 'files' && Array.isArray(changedFields[key])) {
            changedFields[key]
              .filter((e) => typeof e.file === 'object')
              .forEach((file, index) => {
                formData.append(`files[${index}][file]`, file.file);
                formData.append(`files[${index}][type]`, file.type);
              });
          } else if (key === 'classifications' && Array.isArray(changedFields[key])) {
            changedFields[key].forEach((classification, index) => {
              formData.append(`classifications[${index}]`, classification.value || classification);
            });
          } else {
            formData.append(key, changedFields[key]);
          }
        }
      }
    } else {
      formData = changedFields;
    }
    try {
      await mutateAsync({ userData: formData, userId });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.info(t('update_business_info.update_success_message'));
      resetForm();
    } catch (err: any) {
      if (err?.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        toast.error(err.response.data.message);
      }
    }
  };
  if (isLoading) {
    return <Loader />;
  }
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ values, errors, touched, setFieldValue, setFieldTouched }) => (
        <Form className="space-y-6">
          <BusinessDetailsSection
            values={values}
            errors={errors}
            touched={touched}
            countryOptions={countryOptions}
            cityOptions={cityOptions}
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
          />
          <div className="mt-4 ml-auto text-center w-fit">
            <Button type="submit" variant="main" loading={isMutatePutLoading}>
              {t('update_business_info.update')}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
