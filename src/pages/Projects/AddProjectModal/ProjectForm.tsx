import FormField from '@/components/molecules/FormField/FormField';
import ImagesFieldArray from '@/components/molecules/ImagesFieldArray/ImagesFieldArray';
import SelectInput from '@/components/molecules/SelectInput/SelectInput';
import TextAreaField from '@/components/molecules/TextAreaField/TextAreaField';
import { ADMIN_TYPE } from '@/constants/Constants';
import { useUser } from '@/context/UserContext';
import { useFetchUserCategories } from '@/hooks/useCategories';
import { useCountryData } from '@/hooks/useCountryData';
import { useLanguage } from '@/hooks/useLanguage';
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

interface Category {
  has_ideas: number;
}

interface UserCategory {
  category: Category;
}

function ProjectForm({ businessUsers, isMutatePutLoading, isEdit }: ProjectFormProps) {
  const { values, errors, touched, setFieldValue, setFieldTouched } = useFormikContext<any>();
  const { userData } = useUser();
  const { t } = useTranslation();
  const lang = useLanguage();

  const isAdmin = ADMIN_TYPE.includes(userData?.user_type);
  const [currentUserId, setCurrentUserId] = useState<number | undefined>(
    isAdmin ? undefined : userData?.id,
  );

  const { data: response = { payload: [] } } = useFetchUserCategories(
    isAdmin ? currentUserId : userData?.id,
  );
  const userCategories: UserCategory[] =
    'data' in response ? response.data.payload : response.payload || [];

  const addableCategories = userCategories.filter(({ category }) => category?.has_ideas === 1);

  useEffect(() => {
    if (!isAdmin && userData?.id) {
      setCurrentUserId(userData.id);
    }
  }, [isAdmin, userData]);

  const { countryOptions, cityOptions } = useCountryData();

  return (
    <DialogContent className="flex flex-col gap-5">
      <div className="bg-blue-50 text-sm text-blue-800 px-4 py-2 rounded-md text-center">
        <strong>{t('common.project_form.note')}:</strong>
        {t('common.project_form.project_description')}
      </div>

      {/* User Selection for Admins */}
      <div
        className={`"grid grid-cols-1 sm:grid-cols-2 gap-4" ${isAdmin ? 'sm:grid-cols-2' : 'sm:grid-cols-1'}`}
      >
        {isAdmin && (
          <SelectInput
            id="businessUser_id"
            name="businessUser_id"
            label={t('common.project_form.user')}
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
            placeholder={t('common.project_form.select_user')}
            touched={!!touched.businessUser_id}
            error={errors.businessUser_id as string}
            dataTestid="edit-category"
            isDisabled={isMutatePutLoading || isEdit}
          />
        )}

        {!isEdit && (
          <SelectInput
            id="category_id"
            name="category_id"
            label={t('common.project_form.category')}
            value={values.category_id || ''}
            options={addableCategories.map((category: any) => ({
              label: category.category[`name_${lang}`],
              value: category.category.id,
            }))}
            onChange={(options: any) => {
              setFieldValue("category_id", options);
              setFieldValue("service_id", "");
            }}
            placeholder={t('common.project_form.category')}
            touched={!!touched.category_id}
            error={errors.category_id as string}
            dataTestid="category_id"
            required
          />
        )}
      </div>
      {/* Country and City */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectInput
          id="country_id"
          name="country_id"
          label={t('common.project_form.country')}
          value={values.country_id || null}
          options={countryOptions}
          error={errors.country_id as string}
          touched={!!touched.country_id}
          dataTestid="country_id"
          required
        />
        <SelectInput
          id="city_id"
          name="city_id"
          label={t('common.project_form.city')}
          value={values.city_id || null}
          options={cityOptions(values.country_id)}
          error={errors.city_id as string}
          touched={!!touched.city_id}
          dataTestid="city_id"
          required
        />
      </div>

      {/* Creation Date */}
      <FormField
        id="creation_date"
        name="creation_date"
        label={t('common.project_form.creation_date')}
        type="date"
        value={values.creation_date || ''}
        placeholder={t('common.project_form.creation_date')}
        onBlur={() => setFieldTouched('creation_date', true)}
        touched={!!touched.creation_date}
        errors={errors.creation_date ? t(errors.creation_date as string) : undefined}
        required
      />

      {/* English/Arabic Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          id="title_en"
          name="title_en"
          label={t('common.project_form.english_name')}
          type="text"
          value={values.title_en || ''}
          placeholder={t('common.project_form.english_name')}
          onBlur={() => setFieldTouched('title_en', true)}
          touched={!!touched.title_en}
          errors={errors.title_en ? t(errors.title_en as string) : undefined}
          required
        />
        <FormField
          id="title_ar"
          name="title_ar"
          label={t('common.project_form.arabic_name')}
          type="text"
          value={values.title_ar || ''}
          placeholder={t('common.project_form.arabic_name')}
          onBlur={() => setFieldTouched('title_ar', true)}
          touched={!!touched.title_ar}
          errors={errors.title_ar ? t(errors.title_ar as string) : undefined}
        />
      </div>

      {/* English/Arabic Description */}
      <div className="flex flex-col gap-4 mb-8">
        <TextAreaField
          value={values.description_en || ''}
          id="description_en"
          label={t('common.project_form.english_description')}
          name="description_en"
          placeholder={t('common.project_form.english_description')}
          touched={!!touched.description_en}
          errors={typeof errors.description_en === 'string' ? errors.description_en : undefined}
          required
        />
        <TextAreaField
          value={values.description_ar || ''}
          id="description_ar"
          label={t('common.project_form.arabic_description')}
          name="description_ar"
          placeholder={t('common.project_form.arabic_description')}
          touched={!!touched.description_ar}
          errors={typeof errors.description_ar === 'string' ? errors.description_ar : undefined}
        />
      </div>

      {/* Images */}
      <ImagesFieldArray
        form={{ values, errors, touched, setFieldValue, setFieldTouched }}
        isSubmitting={isMutatePutLoading}
        oneImage={false}
      />
    </DialogContent>
  );
}

export default ProjectForm;
