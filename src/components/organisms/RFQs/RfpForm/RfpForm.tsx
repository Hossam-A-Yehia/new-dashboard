import React, { useEffect, useMemo, useState } from 'react';
import { Form } from 'formik';
import { t } from 'i18next';
import SelectInput from '@/components/molecules/SelectInput/SelectInput';
import FormField from '@/components/molecules/FormField/FormField';
import { getAllCategories } from '@/components/templates/AddRfq/AddRfqValidation';
import { useCountryData } from '@/hooks/useCountryData';
import { useLanguage } from '@/hooks/useLanguage';
import { CategoryNode } from '@/types/RFQs';
import FileUploadSection from '@/components/molecules/FileUpload/FileUploadSection';
import TextAreaField from '@/components/molecules/TextAreaField/TextAreaField';
import Button from '@/components/atoms/Button/Button';
import { validateFile } from '@/utils/validateFile';
import { useFetchCategoriesRFQ } from '@/hooks/useCategories';

interface RfpFormProps {
  form: any;
  setStep: (step: number) => void;
  setService: (service: number) => void;
  setCity: (city: number) => void;
  isAsk?: boolean;
}
interface FileWithError {
  file: File;
  error?: string;
}
export const RfpForm: React.FC<RfpFormProps> = ({ form, setStep, setService, setCity, isAsk }) => {
  const { countryOptions, cityOptions } = useCountryData();
  const lang = useLanguage();
  const [services, setServices] = useState<CategoryNode[]>([]);
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [category, setCategory] = useState<CategoryNode[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<FileWithError[]>([]);

  const { data: { payload: allCategories = [] } = {} } = useFetchCategoriesRFQ();

  const memoizedCategories = useMemo(() => {
    return Array.isArray(category) && category.length > 0 ? getAllCategories(category) : [];
  }, [category]);

  useEffect(() => {
    setCategories(memoizedCategories);
  }, [memoizedCategories]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;
    const newFiles: FileWithError[] = Array.from(files).map((file) => ({
      file,
      error: validateFile(file),
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
    const validFiles = [...uploadedFiles, ...newFiles].filter((f) => !f.error).map((f) => f.file);
    form.setFieldValue('files', validFiles);
    event.target.value = '';
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      const validFiles = newFiles.filter((f) => !f.error).map((f) => f.file);
      form.setFieldValue('files', validFiles);
      return newFiles;
    });
  };

  return (
    <Form>
      <div>
        <div
          className={`grid grid-cols-1 ${
            isAsk ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-4'
          } gap-3 pt-6`}
        >
          <SelectInput
            additionalClasses="mt-3"
            value={form.values.buisness_type || ''}
            dataTestid="buisness_type"
            id="buisness_type"
            name="buisness_type"
            label={t('rfq.service_providers_type')}
            options={allCategories.map(
              (type: {
                name_en: string;
                alias: string;
                [key: `name_${string}`]: string | undefined;
              }) => ({
                label: type[`name_${lang}`] || type.name_en,
                value: type.alias,
                categories: type,
              }),
            )}
            placeholder={t('rfq.service_providers_placeholder')}
            required={true}
            error={form.errors.buisness_type}
            touched={form.touched.buisness_type}
            onChange={(option: any) => {
              form.setFieldValue('buisness_type', option);
              form.setFieldValue('category', '');
              form.setFieldValue('service_id', '');
              setCategory([option.categories]);
            }}
          />
          <SelectInput
            additionalClasses="mt-3"
            value={form.values.category || ''}
            dataTestid="category"
            id="category"
            name="category"
            label={t('rfq.category')}
            options={categories.map((category) => ({
              label: category[`name_${lang}`] || category.name_en,
              value: category.id,
              services: category.services,
            }))}
            isDisabled={categories.length === 0}
            placeholder={t('rfq.category')}
            required={true}
            error={form.errors.category}
            touched={form.touched.category}
            onChange={(option: any) => {
              form.setFieldValue('category', option);
              form.setFieldValue('service_id', '');
              setServices(option.services);
            }}
          />
          <SelectInput
            additionalClasses="mt-3"
            value={form.values.service_id || ''}
            dataTestid="service_id"
            id="service_id"
            name="service_id"
            label={t('rfq.service')}
            options={services.map((row) => ({
              label: row[`name_${lang}`] || row.name_en,
              value: row.id,
            }))}
            isDisabled={services.length === 0}
            placeholder={t('rfq.service_placeholder')}
            required={true}
            error={form.errors.service_id}
            touched={form.touched.service_id}
            onChange={(option: any) => {
              form.setFieldValue('service_id', option);
              setService(option.value);
            }}
          />
          <FormField
            dataTestid="subject"
            id="subject"
            label={t('rfq.subject')}
            type="text"
            name="subject"
            placeholder={t('rfq.subject')}
            touched={form.touched.subject}
            errors={form.errors.subject}
            value={form.values.subject}
          />
        </div>
        {!isAsk && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 my-6">
            <SelectInput
              additionalClasses="mt-3"
              value={form.values.country_id || ''}
              id="country_id"
              name="country_id"
              label={t('rfq.country')}
              options={countryOptions}
              placeholder={t('rfq.country_placeholder')}
              error={form.errors.country_id}
              touched={form.touched.country_id}
              dataTestid="country"
            />
            <SelectInput
              additionalClasses="mt-3"
              value={
                cityOptions(form.values?.country_id)?.filter(
                  (cityOption: { value: any }) => cityOption.value === form.values.city_id,
                ) || ''
              }
              id="city_id"
              name="city_id"
              label={t('rfq.city')}
              options={cityOptions(form.values.country_id)}
              placeholder={t('rfq.city_placeholder')}
              error={form.errors.city_id}
              touched={form.touched.city_id}
              dataTestid="city"
              onChange={(option: any) => {
                form.setFieldValue('city_id', option.value);
                setCity(option.value);
              }}
            />
            <FormField
              value={form.values.valid_until}
              id="valid_until"
              label={t('rfq.valid_unit')}
              type="date"
              name="valid_until"
              placeholder={t('rfq.valid_unit')}
              touched={form.touched.valid_until}
              errors={form.errors.valid_until}
              dataTestid="valid_until"
            />
          </div>
        )}
        <div className="mb-3">
          <TextAreaField
            value={form.values.description}
            id="description"
            label={t('rfq.description')}
            name="description"
            placeholder={t('rfq.description')}
            touched={form.touched.description}
            errors={form.errors.description}
            required
            dataTestid="description"
          />
        </div>
        <FileUploadSection
          uploadedFiles={uploadedFiles}
          handleFileChange={handleFileChange}
          removeFile={removeFile}
        />
        <div className="mt-4 text-center w-1/5 ml-auto">
          <Button
            type="button"
            variant="main"
            disabled={
              (!isAsk && !form.values.city_id) ||
              !form.values.service_id ||
              !form.values.subject ||
              (!isAsk && !form.values.valid_until)
            }
            dataTestid="next-button"
            onClick={() => setStep(2)}
          >
            {t('rfq.next')}
          </Button>
        </div>
      </div>
    </Form>
  );
};
