import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useFormikContext } from 'formik';
import { DialogContent } from '@mui/material';
import FormField from '@/components/molecules/FormField/FormField';
import ImagesFieldArray from '@/components/molecules/ImagesFieldArray/ImagesFieldArray';
import TextAreaField from '@/components/molecules/TextAreaField/TextAreaField';
import { attributeDataTypes } from '@/constants/attributes';
import { useFetchProjects } from '@/hooks/Project';
import { useQuery } from '@/hooks/useQuery';
import { useFetchBusinessUsers, useFetchUserServicesForIdea } from '@/hooks/useUser';
import AttributesFieldArray from '@/components/molecules/AttributesFieldArray/AttributesFieldArray';
import SelectInput from '@/components/molecules/SelectInput/SelectInput';

interface IdeaFormProps {
  isMutatePutLoading: boolean;
  isEdit: boolean;
}


interface Attribute {
  data_type: string;
  types: number[];
}

const IdeaForm: React.FC<IdeaFormProps> = ({ isMutatePutLoading, isEdit }) => {
  const { values, errors, touched, setFieldValue, setFieldTouched } = useFormikContext<any>();
  const { t } = useTranslation();
  const queryParams = useQuery();
  const { id: projectId } = useParams();

  queryParams.projectId = projectId || '';

  const { data } = useFetchProjects({ ...queryParams, isEnabled: true });
  const projects = data?.data?.payload?.data || [];

  queryParams.filteredId = projects[0]?.businessUser_id;
  const { data: businessUsersData } = useFetchBusinessUsers(queryParams);
  const userData = businessUsersData?.data?.payload || {};
  const basicUserId = userData?.data?.[0]?.user?.id;
  const { data: userServicesData } = useFetchUserServicesForIdea({
    userId: basicUserId,
  });
  const userServices = (userServicesData as any)?.data?.payload || [];

  const categories_ids = projects[0]?.categories?.map((category: { id: any }) => category.id);
  const newServices = userServices?.filter((e: { service: { category_id: any } }) =>
    categories_ids?.includes(e.service.category_id),
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
      if (updatedItem?.types?.includes(1)) {
        result.push(updatedItem);
      }
      if (isEdit) {
        result.push(updatedItem);
      }
    } else if (item?.types?.includes(1)) {
      result.push(item);
    }

    return result;
  }, []);



  return (
    <DialogContent className="flex flex-col gap-5">
        <SelectInput
          id="user_service_id"
          name="user_service_id"
          label={t('Service')}
          value={values.user_service_id || ''}
          options={newServices?.map(
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
          placeholder={t('Category')}
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
        <FormField
          id="title_en"
          name="title_en"
          label={t('English Name')}
          type="text"
          value={values.title_en || ''}
          placeholder={t('English Name')}
          onBlur={() => setFieldTouched('title_en', true)}
          touched={!!touched.title_en}
          errors={errors.title_en ? t(errors.title_en as string) : undefined}
          required
        />

        <FormField
          id="title_ar"
          name="title_ar"
          label={t('Arabic Name')}
          type="text"
          value={values.title_ar || ''}
          placeholder={t('Arabic Name')}
          onBlur={() => setFieldTouched('title_ar', true)}
          touched={!!touched.title_ar}
          errors={errors.title_ar ? t(errors.title_ar as string) : undefined}
        />
      </div>
      <div>
        <div className="flex flex-col gap-4 mb-8">
          <TextAreaField
            value={values.description_en || ''}
            id="description_en"
            label={t('English Description')}
            name="description_en"
            placeholder={t(
              'business_profile_form.business_resume_form.business_desc_placeholder_en',
            )}
            touched={!!touched.description_en}
            errors={typeof errors.description_en === 'string' ? errors.description_en : undefined}
            required
          />

          <TextAreaField
            value={values.description_ar || ''}
            id="description_ar"
            label={t('Arabic Description')}
            name="description_ar"
            placeholder={t('Description')}
            touched={!!touched.description_ar}
            errors={typeof errors.description_ar === 'string' ? errors.description_ar : undefined}
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
            oneImage
          />
        )}
      </div>
    </DialogContent>
  );
};

export default IdeaForm;
