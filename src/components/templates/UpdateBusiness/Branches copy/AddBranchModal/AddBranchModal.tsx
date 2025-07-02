import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Formik } from 'formik';
import { BranchFormValues, initialValues, getValidationSchema } from './utils';
import Button from '@/components/atoms/Button/Button';
import FormField from '@/components/molecules/FormField/FormField';
import Modal, { ModalBody, ModalFooter, ModalHeader } from '@/components/atoms/Modal/Modal';
import { useDisclosure } from '@/hooks/useDisclosure';
import MapComponent from '@/components/molecules/Map/Map';
import { t } from 'i18next';
import SelectInput from '@/components/molecules/SelectInput/SelectInput';
import { useCountryData } from '@/hooks/useCountryData';
import { useMutateAddBranch } from '@/hooks/useBranches';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

interface AddBranchModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
}

const AddBranchModal: React.FC<AddBranchModalProps> = ({ open, onClose, userId }) => {
  const queryClient = useQueryClient();

  const mapModal = useDisclosure();
  const { countryOptions, cityOptions } = useCountryData();
  const { mutateAsync, isPending } = useMutateAddBranch();
  const onSubmit = (values: BranchFormValues) => {
    const structuredData = {
      branch_name: values.branchName,
      city_id: values.city,
      user_id: userId,
      email: values.email,
      phone: values.phone,
      lat: values.lat,
      lang: values.lang,
    };

    mutateAsync(structuredData)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['branches'] });
        toast.info(t('Branch Added Successfully!'));
        onClose();
      })
      .catch(() => {
        toast.error(t('The email or phone has already been taken.'));
      });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle className="text-main">{t('Add Branch')}</DialogTitle>

      <Formik
        initialValues={initialValues}
        validationSchema={getValidationSchema()}
        onSubmit={(values) => onSubmit(values)}
      >
        {({ handleSubmit, setFieldValue, values, touched, errors, setFieldTouched }) => (
          <form onSubmit={handleSubmit}>
            <DialogContent className="flex flex-col gap-4">
              <FormField
                required
                id="location"
                label={t('business_profile_form.basic_form.location')}
                type="text"
                name="location"
                readOnly
                onClick={mapModal.onOpen}
                touched={touched.lang}
                errors={errors.lang}
                onBlur={() => setFieldTouched('lang', true)}
                placeholder={
                  values.lat && values.lang
                    ? `${Number(values.lat).toFixed(5)}, ${Number(values.lang).toFixed(5)}`
                    : t('business_profile_form.basic_form.location')
                }
                value={
                  values.lat && values.lang
                    ? `${Number(values.lat).toFixed(5)}, ${Number(values.lang).toFixed(5)}`
                    : ''
                }
              />
              <div className="flex items-center justify-between gap-3">
                <SelectInput
                  additionalClasses="w-full"
                  id="country"
                  name="country"
                  label={t('add_branch.country')}
                  options={countryOptions}
                  placeholder={t('add_branch.country_placeholder')}
                  error={errors.country}
                  touched={touched.country}
                  dataTestid="country-branch"
                  required
                />
                <SelectInput
                  additionalClasses="w-full"
                  id="city"
                  name="city"
                  label={t('add_branch.city')}
                  options={cityOptions(values.country)}
                  placeholder={t('add_branch.city_placeholder')}
                  error={errors.city}
                  touched={touched.city}
                  dataTestid="city-branch"
                  required
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <FormField
                  additionalClasses="w-full"
                  dataTestid="branchName"
                  id="branchName"
                  label={t('add_branch.branch_name')}
                  type="text"
                  name="branchName"
                  placeholder={t('add_branch.branch_name_placeholder')}
                  touched={touched.branchName}
                  errors={errors.branchName}
                  onBlur={() => setFieldTouched('branchName', true)}
                  required
                />
                <FormField
                  additionalClasses="w-full"
                  dataTestid="postCode-branch"
                  id="postCode"
                  label={t('add_branch.post_code')}
                  type="text"
                  name="postCode"
                  placeholder={t('add_branch.post_code_placeholder')}
                  touched={touched.postCode}
                  errors={errors.postCode}
                  onBlur={() => setFieldTouched('postCode', true)}
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <FormField
                  additionalClasses="w-full"
                  dataTestid="phone-branch"
                  id="phone"
                  label={t('add_branch.phone')}
                  type="text"
                  name="phone"
                  placeholder={t('add_branch.phone_placeholder')}
                  touched={touched.phone}
                  errors={errors.phone}
                  onBlur={() => setFieldTouched('phone', true)}
                  required
                />
                <FormField
                  additionalClasses="w-full"
                  dataTestid="email-branch"
                  id="email"
                  label={t('add_branch.email')}
                  type="email"
                  name="email"
                  placeholder={t('add_branch.email_placeholder')}
                  touched={touched.email}
                  errors={errors.email}
                  onBlur={() => setFieldTouched('email', true)}
                  required
                />
              </div>
            </DialogContent>
            <DialogActions>
              <div>
                <Button onClick={onClose} variant="secondary">
                  {t('Cancel')}
                </Button>
              </div>
              <div>
                <Button type="submit" variant="main" disabled={isPending}>
                  {t('Save')}
                </Button>
              </div>
            </DialogActions>

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
                    values.lat && values.lang
                      ? { lat: Number(values.lat), lng: Number(values.lang) }
                      : undefined
                  }
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="main"
                  additionalClasses="!w-fit mx-auto"
                  onClick={mapModal.onClose}
                >
                  {t('business_profile_form.shared.save')}
                </Button>
              </ModalFooter>
            </Modal>
          </form>
        )}
      </Formik>
    </Dialog>
  );
};

export default AddBranchModal;
