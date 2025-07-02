import FormField from '@/components/molecules/FormField/FormField';
import SelectInput from '@/components/molecules/SelectInput/SelectInput';
import { useBusinessForm } from '@/hooks/useBusinessForm';
import { t } from 'i18next';
import Modal, { ModalBody, ModalFooter, ModalHeader } from '@/components/atoms/Modal/Modal';
import Button from '@/components/atoms/Button/Button';
import { useDisclosure } from '@/hooks/useDisclosure';
import CoverUpload from '@/components/molecules/CoverUpload/CoverUpload';
import LogoUpload from '@/components/molecules/LogoUpload/LogoUpload';
import RadioGroup from '@/components/molecules/RadioGroup/RadioGroup';
import MultiSelectInput from '@/components/molecules/MultiSelectInput/MultiSelectInput';
import MapComponent from '@/components/molecules/Map/Map';
import FileUploaderField from '../FileUpload/FileUploaderField';

interface BusinessDetailsProps {
  values: {
    business_name: string;
    business_email: string;
    phone: string;
    hotline: string;
    country_id: string | number;
    city_id: string | number;
    business_des: string;
    business_des_ar: string;
    lat?: number;
    lang?: number;
    logo: string;
    profile: string;
  };
  errors: any;
  touched: any;
  setFieldValue: (field: string, value: any) => void;
  setFieldTouched: any;
  countryOptions: { value: string | number; label: string }[];
  cityOptions: (countryId: string | number) => { value: string | number; label: string }[];
}

export function BusinessDetailsSection({
  values,
  errors,
  touched,
  countryOptions,
  cityOptions,
  setFieldValue,
  setFieldTouched,
}: BusinessDetailsProps) {
  const {
    priceRangeOptions,
    volumeOfWorkOptions,
    numberOfEmployeesOptions,
    yearsOfExperienceOptions,
    isSupplier,
    contractorClassificationsOptions,
    supplierClassificationsOptions,
    isContractor,
    isCraftsmen,
    isFreelance,
  } = useBusinessForm();
  const mapModal = useDisclosure();

  return (
    <>
      <ul
        className="mx-auto mb-4 text-sm text-center text-slate-500"
        style={{ width: 'fit-content' }}
      >
        <li>{t('update_business_info.Maximum_file_size_2_MB')}</li>
        <li>{t('update_business_info.Minimum_dimensions_720_x_720_pixels')}</li>
      </ul>

      <div className="flex items-center pb-6 justify-evenly">
        <CoverUpload name="profile" setFieldValue={setFieldValue} defaultImage={values.profile} />
        <LogoUpload name="logo" setFieldValue={setFieldValue} defaultImage={values.logo} />
      </div>
      <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2 ">
        <FormField
          id="business_name"
          label={t('update_business_info.business_name')}
          name="business_name"
          touched={touched.business_name}
          errors={errors.business_name}
          value={values.business_name}
          placeholder={t('update_business_info.business_name_placeholder')}
          onBlur={() => setFieldTouched('business_name', true)}
          required
        />
        <FormField
          id="business_email"
          label={t('update_business_info.business_email')}
          name="business_email"
          value={values.business_email}
          placeholder={t('update_business_info.business_email_placeholder')}
          touched={touched.business_email}
          errors={errors.business_email}
          onBlur={() => setFieldTouched('business_email', true)}
          required
        />
        <FormField
          id="phone"
          label={t('update_business_info.phone')}
          name="phone"
          touched={touched.phone}
          errors={errors.phone}
          value={values.phone}
          placeholder={t('update_business_info.phone_placeholder')}
          onBlur={() => setFieldTouched('phone', true)}
        />
        <FormField
          id="business_des"
          label={t('update_business_info.business_des_en')}
          name="business_des"
          touched={touched.business_des}
          errors={errors.business_des}
          value={values.business_des}
          placeholder={t('update_business_info.business_desc_placeholder_en')}
          onBlur={() => setFieldTouched('business_des', true)}
          required
        />
        <FormField
          id="business_des_ar"
          label={t('update_business_info.business_des_ar')}
          name="business_des_ar"
          touched={touched.business_des_ar}
          errors={errors.business_des_ar}
          value={values.business_des_ar}
          placeholder={t('update_business_info.business_des_placeholder_ar')}
          onBlur={() => setFieldTouched('business_des_ar', true)}
        />
        <FormField
          id="hotline"
          label={t('update_business_info.hotline')}
          name="hotline"
          value={values.hotline}
          placeholder={''}
          errors={errors.business_des}
          touched={touched.hotline}
          onBlur={() => setFieldTouched('hotline', true)}
        />
        <SelectInput
          id="country_id"
          name="country_id"
          label={t('update_business_info.country')}
          options={countryOptions}
          error={errors.country_id}
          touched={touched.country_id}
          dataTestid="country_id"
          required
        />

        <SelectInput
          id="city_id"
          name="city_id"
          label={t('update_business_info.city')}
          options={cityOptions(values.country_id)}
          error={errors.city_id}
          touched={touched.city_id}
          dataTestid="city_id"
          required
        />
        <FormField
          id="hotline"
          label={t('update_business_info.hotline')}
          name="hotline"
          value={values.hotline}
          placeholder={''}
          errors={errors.business_des}
          touched={touched.hotline}
          onBlur={() => setFieldTouched('hotline', true)}
        />
        <RadioGroup
          options={priceRangeOptions}
          label={t('business_profile_form.business_history_form.price_range')}
          name="price_range"
          selectedValue={1}
          error={errors.price_range as string}
        />
        <SelectInput
          dataTestid="volume_of_work"
          id="volume_of_work"
          name="volume_of_work"
          label={t('business_profile_form.business_history_form.volume_of_work')}
          options={volumeOfWorkOptions}
          placeholder={t('business_profile_form.business_history_form.volume_of_work_placeholder')}
          touched={touched.volume_of_work}
          error={errors.volume_of_work}
        />
        {!isCraftsmen && !isFreelance && (
          <SelectInput
            dataTestid="number_of_employees"
            id="number_of_employees"
            name="number_of_employees"
            label={t('business_profile_form.business_history_form.number_of_employees')}
            options={numberOfEmployeesOptions}
            placeholder={t(
              'business_profile_form.business_history_form.number_of_employees_placeholder',
            )}
            touched={touched.number_of_employees}
            error={errors.number_of_employees}
          />
        )}
        <SelectInput
          dataTestid="years_of_experience"
          id="years_of_experience"
          name="years_of_experience"
          label={t('business_profile_form.business_history_form.years_of_experience')}
          options={yearsOfExperienceOptions}
          placeholder={t(
            'business_profile_form.business_history_form.years_of_experience_placeholder',
          )}
          touched={touched.years_of_experience}
          error={errors.years_of_experience}
        />
        {(isSupplier || isContractor) && (
          <MultiSelectInput
            id="classifications"
            name="classifications"
            label={t('business_profile_form.business_history_form.classifications')}
            targetID
            options={isSupplier ? supplierClassificationsOptions : contractorClassificationsOptions}
            placeholder={t(
              'business_profile_form.business_history_form.classifications_placeholder',
            )}
            touched={!!touched.classifications}
            error={errors.classifications as string}
          />
        )}
        <FormField
          id="location"
          label={t('business_profile_form.basic_form.location')}
          type="text"
          name="location"
          readOnly
          placeholder={
            values.lat && values.lang
              ? `${Number(values.lat).toFixed(5)}, ${Number(values.lang).toFixed(5)}`
              : t('business_profile_form.basic_form.location')
          }
          onClick={mapModal.onOpen}
          touched={touched.hotline}
          errors={errors.hotline}
          required
        />
        <Modal isOpen={mapModal.isOpen} onClose={mapModal.onClose}>
          <ModalHeader dataTestid="map-modal-title">
            {t('business_profile_form.basic_form.business_location')}
          </ModalHeader>
          <ModalBody className="w-[800px] max-w-full">
            <MapComponent
              setLatLng={(latLng) => {
                setFieldValue('lat', latLng.lat);
                setFieldValue('lang', latLng.lng);
              }}
              defaultLocation={
                values.lat
                  ? {
                      lat: Number(values.lat),
                      lng: Number(values.lang),
                    }
                  : undefined
              }
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="main" additionalClasses="!w-fit mx-auto" onClick={mapModal.onClose}>
              {t('business_profile_form.shared.save')}
            </Button>
          </ModalFooter>
        </Modal>
      </div>
      <div>
        <FileUploaderField
          name="files"
          label={t("update_business_info.Business_Documents")}
          subtitle={t("update_business_info.Files_Max_Limit_is_5_files")}
          maxFiles={5}
        />
      </div>
    </>
  );
}
