import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import { Formik, Form } from 'formik';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import Button from '@/components/atoms/Button/Button';
import FormField from '@/components/molecules/FormField/FormField';
import { useEditUserServiceRequest, useMutateServiceRequest } from '@/hooks/useSuggestServices';
import { useFetchUserCategories } from '@/hooks/useCategories';
import { SERVICE_PROVIDER_SERVICE_TYPE, SUPPLIER_SERVICE_TYPE } from '@/constants/Constants';
import { editInitialValues, getValidationSchema, initialValues } from './utils';
import { CategoryTypesEnum } from '../../UpdateUserCategories/ValidationSchema';
import SelectInput from '@/components/molecules/SelectInput/SelectInput';

interface FormValues {
  category: { label: string; value: number } | null;
  name_en: string;
  name_ar: string;
}

interface SelectedRow {
  id: number;
  name_ar: string;
  name_en: string;
  category_id: number;
  service_type?: any;
}

interface SelectedUser {
  user: {
    user_type_value: keyof typeof CategoryTypesEnum;
  };
}

interface AddServiceRequestModalProps {
  open: boolean;
  onClose: () => void;
  isEdit: boolean;
  userID: string;
  selectedRow?: SelectedRow;
  selectedUser?: SelectedUser;
}

const AddServiceRequestModal: React.FC<AddServiceRequestModalProps> = ({
  open,
  onClose,
  isEdit,
  userID,
  selectedRow,
  selectedUser,
}) => {
  const [lang] = useState<'en' | 'ar'>(
    () => (localStorage.getItem('I18N_LANGUAGE') as 'en' | 'ar') || 'en',
  );
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { mutateAsync, isPending } = isEdit
    ? useEditUserServiceRequest()
    : useMutateServiceRequest();
  const { data = { data: { payload: [] } } } = useFetchUserCategories(Number(userID));

  const userCategories = data.data.payload;

  const categoryType = selectedUser?.user?.user_type_value
    ? CategoryTypesEnum[selectedUser.user.user_type_value]
    : null;

  const handleSubmit = async (values: FormValues, { resetForm }: { resetForm: () => void }) => {
    const serviceTypeValue =
      categoryType === CategoryTypesEnum.SUPPLIER
        ? SUPPLIER_SERVICE_TYPE
        : SERVICE_PROVIDER_SERVICE_TYPE;

    const structuredData = {
      name_ar: values.name_ar,
      name_en: values.name_en,
      category_id: values.category?.value || 0,
      service_type: serviceTypeValue,
    };

    try {
      if (isEdit && selectedRow) {
        await mutateAsync({
          userData: structuredData,
          suggestionId: selectedRow.id,
        });
        toast.info(t('suggestServices.suggessionUpdatedSuccess'));
      } else {
        await mutateAsync(structuredData);
        toast.info(t('suggestServices.suggessionAddedSuccess'));
      }
      queryClient.invalidateQueries({ queryKey: ['UserSuggestions', userID] });
      resetForm();
      onClose();
    } catch (err: any) {
      toast.error(t(err.response?.data?.message) || t('suggestServices.deleteErrorMessage'));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle className="text-main">{isEdit ? t('suggestServices.Edit') : t('suggestServices.addNew')}</DialogTitle>

      <Formik
        initialValues={
          isEdit && selectedRow
            ? editInitialValues({ ...selectedRow, service_type: selectedRow.service_type || null })
            : initialValues()
        }
        validationSchema={getValidationSchema()}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, touched, errors, setFieldTouched }) => (
          <Form>
            <DialogContent className="flex flex-col gap-4">
              <SelectInput
                additionalClasses="w-full"
                value={values.category || null}
                id="category"
                name="category"
                label={t('update_user_services.select_your_categories')}
                options={userCategories?.map(
                  (category: { category: { [x: string]: any; id: any } }) => ({
                    label: category.category[`name_${lang}`],
                    value: category.category.id,
                  }),
                )}
                onChange={(option: any) => {
                  setFieldValue('category', option);
                }}
                placeholder={t('update_user_services.select_your_categories_placeholder')}
                touched={!!touched.category}
                error={errors.category as string}
                dataTestid="edit-category"
                required
              />
              <div className="flex items-center justify-between gap-3">
                <FormField
                  additionalClasses="w-full"
                  dataTestid="name-en-service"
                  id="name_en"
                  label={`${t('suggestServices.EnglishName')}`}
                  type="text"
                  name="name_en"
                  placeholder={t('suggestServices.EnglishName')}
                  touched={!!touched.name_en}
                  errors={
                    touched.name_en && errors.name_en ? t(errors.name_en as string) : undefined
                  }
                  onBlur={() => setFieldTouched('name_en', true)}
                  disabled={isPending}
                  required
                  value={values.name_en || ''}
                />
                <FormField
                  additionalClasses="w-full"
                  dataTestid="name-ar-service"
                  id="name_ar"
                  label={t('suggestServices.ArabicName')}
                  type="text"
                  name="name_ar"
                  placeholder={t('suggestServices.ArabicName')}
                  touched={!!touched.name_ar}
                  errors={
                    touched.name_ar && errors.name_ar ? t(errors.name_ar as string) : undefined
                  }
                  onBlur={() => setFieldTouched('name_ar', true)}
                  disabled={isPending}
                  value={values.name_ar || ''}
                />
              </div>
            </DialogContent>
            <DialogActions>
              <div>
                <Button onClick={onClose} variant="secondary">
                  {t('suggestServices.Cancel')}
                </Button>
              </div>
              <div>
              <Button type="submit" variant="main" disabled={isPending}>
                {isPending ? (
                  <CircularProgress size={20} className="mr-2" />
                ) : isEdit ? (
                  <i className="ri-pencil-fill align-bottom mr-2" />
                ) : (
                  <i className="mdi mdi-plus-circle-outline mr-2" />
                )}
                {isEdit ? t('suggestServices.Update') : t('suggestServices.Save')}
              </Button>
              </div>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default AddServiceRequestModal;
