import AttributesFieldArray from '@/components/molecules/AttributesFieldArray/AttributesFieldArray';
import FormField from '@/components/molecules/FormField/FormField';
import ImagesFieldArray from '@/components/molecules/ImagesFieldArray/ImagesFieldArray';
import SelectInput from '@/components/molecules/SelectInput/SelectInput';
import TextAreaField from '@/components/molecules/TextAreaField/TextAreaField';
import { attributeDataTypes } from '@/constants/attributes';
import { ADMIN_TYPE } from '@/constants/Constants';
import { useUser } from '@/context/UserContext';
import {
  useFetchUserServicesForIdea,
} from '@/hooks/useUser';
import { DialogContent } from '@mui/material';
import { useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ProjectFormProps {
  setInputSelectValue: React.Dispatch<React.SetStateAction<string>>;
  businessUsers: any;
  isUsersLoading: boolean;
  isMutatePutLoading: boolean;
  setModal: (value: boolean) => void;
  isEdit: boolean;
}

interface Attribute {
  data_type: string;
  types: number[];
}


function ProjectForm({ businessUsers, isMutatePutLoading, isEdit }: ProjectFormProps) {
  const { values, errors, touched, setFieldValue, setFieldTouched } = useFormikContext<any>();
  const { userData } = useUser();
  const { t } = useTranslation();
  const isAdmin = ADMIN_TYPE.includes(userData?.user_type);
  const [currentUserId, setCurrentUserId] = useState<number | undefined>(
    isAdmin ? values.user_id : userData?.id,
  );

  const serviceAttributes =
    (isEdit ? values?.attributes : values.user_service_id?.service?.attributes) || [];
  const updatedAttributeDataTypes = serviceAttributes.reduce((result: any[], item: Attribute) => {
    const matchingObject = attributeDataTypes.find((obj) => obj.value === item.data_type);

    if (matchingObject) {
      const updatedItem = {
        ...item,
        ...matchingObject,
      };
      if (updatedItem?.types?.includes(2)) {
        result.push(updatedItem);
      }
      if (isEdit) {
        result.push(updatedItem);
      }
    } else if (item?.types?.includes(2)) {
      result.push(item);
    }
    return result;
  }, []);

  const { data: userServicesData } = useFetchUserServicesForIdea({
    userId: String(currentUserId),
  });
  const userServices = (userServicesData as any)?.data?.payload || [];

  useEffect(() => {
    if (!isAdmin && userData?.id) {
      setCurrentUserId(userData.id);
    }
  }, [isAdmin, userData]);

  return (
    <DialogContent className="flex flex-col gap-5">
      <div className="bg-blue-50 text-sm text-blue-800 px-4 py-2 rounded-md text-center">
        <strong>{t('addProduct.message.note')}:</strong>
        {t(
          'addProduct.message.mustAddProductVarient',
        )}
      </div>
      <div
        className={`"grid grid-cols-1 sm:grid-cols-2 gap-4" ${isAdmin ? 'sm:grid-cols-2' : 'sm:grid-cols-1'}`}
      >
        {isAdmin && (
          <SelectInput
            id="businessUser_id"
            name="businessUser_id"
            label={t('addProduct.Form.user')}
            value={values.businessUser_id || null}
            options={businessUsers?.map((user: any) => ({
              label: user?.user?.username,
              value: user?.user_id,
              value2: user?.id,
            }))}
            onChange={(option: { value: number }) => {
              setFieldValue('businessUser_id', option);
              setFieldValue('category_id', '');
              setCurrentUserId(option.value);
            }}
            placeholder={t('addProduct.Form.placeHolders.selectUser')}
            touched={!!touched.businessUser_id}
            error={errors.businessUser_id as string}
            dataTestid="edit-category"
            isDisabled={isMutatePutLoading || isEdit}
          />
        )}
      </div>
      <SelectInput
        id="user_service_id"
        name="user_service_id"
        label={t('addProduct.Form.service')}
        value={values.user_service_id || ''}
        options={userServices?.map(
          (row: { service: { name_en: any; attributes: string | any[] }; id: any }) => ({
            ...row,
            label: row.service.name_en,
            value: row.id,
            isDisabled: row.service.attributes.length === 0,
          }),
        )}
        onChange={(option: any) => {
          setFieldValue('user_service_id', option);
          setFieldValue('attributes', [{ attribute_id: null, value: '' }]);
        }}
        placeholder={t('addProduct.Form.placeHolders.service')}
        touched={!!touched.user_service_id}
        error={errors.user_service_id as string}
        dataTestid="user_service_id"
        required
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AttributesFieldArray
          form={{ values, errors, touched, setFieldValue, setFieldTouched }}
          isMutatePutLoading={isMutatePutLoading}
          attributes={updatedAttributeDataTypes}
        />
      </div>

      {/* English/Arabic Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          id="title_en"
          name="title_en"
          label={t('addProduct.Form.englishName')}
          type="text"
          value={values.title_en || ''}
          placeholder={t('addProduct.Form.placeHolders.englishName')}
          onBlur={() => setFieldTouched('title_en', true)}
          touched={!!touched.title_en}
          errors={errors.title_en ? t(errors.title_en as string) : undefined}
          required
        />
        <FormField
          id="title_ar"
          name="title_ar"
          label={t('addProduct.Form.arabicName')}
          type="text"
          value={values.title_ar || ''}
          placeholder={t('addProduct.Form.placeHolders.arabicName')}
          onBlur={() => setFieldTouched('title_ar', true)}
          touched={!!touched.title_ar}
          errors={errors.title_ar ? t(errors.title_ar as string) : undefined}
        />
      </div>

      <div >
        <div className="flex flex-col gap-4 mb-8">
          <TextAreaField
            value={values.short_des_en || ''}
            id="short_des_en"
            label={t('addProduct.Form.englishDesctiption')}
            name="short_des_en"
            placeholder={t(
              'addProduct.Form.placeHolders.englishDesctiption',
            )}
            touched={!!touched.short_des_en}
            errors={typeof errors.short_des_en === 'string' ? errors.short_des_en : undefined}
            required
          />
          <TextAreaField
            value={values.short_des_ar || ''}
            id="short_des_ar"
            label={t('addProduct.Form.arabicDescription')}
            name="short_des_ar"
            placeholder={t('addProduct.Form.placeHolders.arabicDescription')}
            touched={!!touched.short_des_ar}
            errors={typeof errors.short_des_ar === 'string' ? errors.short_des_ar : undefined}
          />
          <TextAreaField
            value={values.short_des_en || ''}
            id="rich_des_en"
            label={t('addProduct.Form.englishRichDescription')}
            name="rich_des_en"
            placeholder={t(
              'addProduct.Form.placeHolders.englishRichDescription',
            )}
            touched={!!touched.rich_des_en}
            errors={typeof errors.rich_des_en === 'string' ? errors.rich_des_en : undefined}
            required
          />
          <TextAreaField
            value={values.rich_des_ar || ''}
            id="rich_des_ar"
            label={t('addProduct.Form.arabicRichDescription')}
            name="rich_des_ar"
            placeholder={t('addProduct.Form.placeHolders.arabicRichDescription')}
            touched={!!touched.rich_des_ar}
            errors={typeof errors.rich_des_ar === 'string' ? errors.rich_des_ar : undefined}
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
      </div>
    </DialogContent>
  );
}

export default ProjectForm;
