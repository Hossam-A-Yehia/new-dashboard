import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { Form, Formik } from 'formik';
import { AddressFormValues, getValidationSchema, initialValues } from './utils';
import Button from '@/components/atoms/Button/Button';
import FormField from '@/components/molecules/FormField/FormField';
import Modal, { ModalBody, ModalFooter, ModalHeader } from '@/components/atoms/Modal/Modal';
import { useDisclosure } from '@/hooks/useDisclosure';
import MapComponent from '@/components/molecules/Map/Map';
import { t } from 'i18next';
import SelectInput from '@/components/molecules/SelectInput/SelectInput';
import { useCountryData } from '@/hooks/useCountryData';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useMutateAddAddress } from '@/hooks/useAddress';

interface AddBranchModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
}

const AddAddressModal: React.FC<AddBranchModalProps> = ({ open, onClose, userId }) => {
  const queryClient = useQueryClient();

  const mapModal = useDisclosure();
  const { countryOptions, cityOptions } = useCountryData();
  const { mutateAsync, isPending } = useMutateAddAddress();
  const onSubmit = (values: AddressFormValues) => {

    const structuredData = {
      title: values.addressTitle,
      street_address: values.streetAddress,
      special_instructions: values.specialInstructions,
      post_code: values.postCode,
      city_id: values.city,
      user_id: userId,
      email: values.email,
      phone: values.phone,
      lat: values.lat,
      lang: values.lang,
    };

    mutateAsync(structuredData)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['Address'] });
        toast.info(t('Address Added Successfully!'));
        onClose()
      })
      .catch((err) => {
        toast.error(t(err.response.data.message));
      });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle className="text-main">{t('add_address.header')}</DialogTitle>

      <Formik 
      initialValues={initialValues} 
      validationSchema={getValidationSchema()} 
      onSubmit={onSubmit}
      >
        {({ errors, touched, values, setFieldValue, setFieldTouched }) => (
          <>
            <Form>
              <DialogContent className="flex flex-col">
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
                  touched={touched.lang}
                  errors={errors.lang}
                  required
                />
                <FormField
                  id="addressTitle"
                  label={t('add_address.address_title')}
                  type="text"
                  name="addressTitle"
                  placeholder={t('add_address.address_title_placeholder')}
                  touched={touched.addressTitle}
                  errors={errors.addressTitle}
                  required
                  onBlur={() => setFieldTouched('addressTitle', true)}
                />
                <FormField
                  id="phone"
                  label={t('add_address.phone')}
                  type="text"
                  name="phone"
                  placeholder={t('add_address.phone_placeholder')}
                  touched={touched.phone}
                  errors={errors.phone}
                  onBlur={() => setFieldTouched('phone', true)}
                  required
                />
                <FormField
                  id="specialInstructions"
                  label={t('add_address.special_instructions')}
                  type="text"
                  name="specialInstructions"
                  placeholder={t('add_address.special_instructions_placeholder')}
                  touched={touched.specialInstructions}
                  errors={errors.specialInstructions}
                />
                <SelectInput
                  id="country"
                  name="country"
                  label={t('add_address.country')}
                  options={countryOptions}
                  placeholder={t('add_address.country_placeholder')}
                  error={errors.country}
                  touched={touched.country}
                  dataTestid="edit-country"
                  required
                />
                <SelectInput
                  id="city"
                  name="city"
                  label={t('add_address.city')}
                  options={cityOptions(values.country)}
                  placeholder={t('add_address.city_placeholder')}
                  error={errors.city}
                  touched={touched.city}
                  required
                />
                <FormField
                  id="streetAddress"
                  label={t('add_address.street_address')}
                  type="text"
                  name="streetAddress"
                  placeholder={t('add_address.street_address_placeholder')}
                  touched={touched.streetAddress}
                  errors={errors.streetAddress}
                />
                <FormField
                  id="email"
                  label={t('add_address.email')}
                  type="email"
                  name="email"
                  placeholder={t('add_address.email_placeholder')}
                  touched={touched.email}
                  errors={errors.email}
                  onBlur={() => setFieldTouched('email', true)}
                  required
                />
                <FormField
                  id="postCode"
                  label={t('add_address.post_code')}
                  type="text"
                  name="postCode"
                  placeholder={t('add_address.post_code_placeholder')}
                  touched={touched.postCode}
                  errors={errors.postCode}
                  onBlur={() => setFieldTouched('postCode', true)}
                />
              </DialogContent>
              <div className="w-fit mt-3 mx-auto mb-4">
                <Button dataTestid="submit-button" type="submit" variant="main" loading={isPending}>
                  {t('add_address.add_addres_btn')}
                </Button>
              </div>
            </Form>
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
                <Button
                  variant="main"
                  additionalClasses="!w-fit mx-auto"
                  onClick={mapModal.onClose}
                >
                  {t('business_profile_form.shared.save')}
                </Button>
              </ModalFooter>
            </Modal>
          </>
        )}
      </Formik>
    </Dialog>
  );
};

export default AddAddressModal;
