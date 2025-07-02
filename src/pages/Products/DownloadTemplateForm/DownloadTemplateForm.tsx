import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useMutateDownloadTemplate } from '@/hooks/useProducts';
import SelectInput from '@/components/molecules/SelectInput/SelectInput';
import { useFetchUserServicesForIdea } from '@/hooks/useUser';
import Button from '@/components/atoms/Button/Button';
import { DownloadCloud } from 'lucide-react';

interface DownloadTemplateFormProps {
  setModal: (open: boolean) => void;
  toggle: () => void;
  userId: string;
  templateModal: boolean;
}

const DownloadTemplateForm: React.FC<DownloadTemplateFormProps> = ({
  templateModal,
  setModal,
  toggle,
  userId,
}) => {
  const { t } = useTranslation();
  const { mutateAsync, isPending: isLoading } = useMutateDownloadTemplate();

  const { data: userServicesData } = useFetchUserServicesForIdea({
    userId: String(userId),
  });
  const userServices = (userServicesData as any)?.data?.payload || [];

  const validationSchema = Yup.object({
    user_service_id: Yup.object().required(t('downloadTemplateForm.serviceValidation')),
  });

  const handleSubmit = (values: any, { resetForm, setErrors }: any) => {
    mutateAsync(values.user_service_id.value)
      .then((response) => {
        const link = document.createElement('a');
        link.href = response?.data?.payload?.replace(/^http:\/\//i, 'https://');
        link.setAttribute('download', '');
        document.body.appendChild(link);
        link.click();
        toast.info(t('downloadTemplateForm.downloadTemplateSuccessMessage'));
        setModal(false);
        resetForm();
      })
      .catch((err: any) => {
        if (err?.response?.data?.errors) {
          setErrors(err?.response?.data?.errors);
        } else {
          toast.error(t(err.response?.data?.message || t('downloadTemplateForm.downloadTemplateErrorMessage')));
        }
      });
  };
  return (
    <Dialog open={templateModal} onClose={toggle} fullWidth maxWidth="sm">
      <DialogTitle className="text-lg font-semibold">{t('downloadTemplateForm.downloadProductTemplate')}</DialogTitle>

      <Formik
        initialValues={{
          user_service_id: '',
          attributes: [{ attribute_id: null, value: '' }],
          user_id: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(form) => (
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
              return false;
            }}
          >
            <DialogContent className="space-y-4">
              <div className="w-full">
                <SelectInput
                  id="user_service_id"
                  name="user_service_id"
                  label={t('downloadTemplateForm.productGroup')}
                  value={form.values.user_service_id}
                  options={userServices?.map(
                    (row: { service: { name_en: any; attributes: string | any[] }; id: any }) => ({
                      ...row,
                      label: row.service.name_en,
                      value: row.id,
                      isDisabled: row.service.attributes.length === 0,
                    }),
                  )}
                  onChange={(option: any) => {
                    form.setFieldValue('user_service_id', option);
                  }}
                  placeholder={t('downloadTemplateForm.chooseTemplate')}
                  touched={!!form.touched.user_service_id}
                  error={form.errors.user_service_id as string}
                  dataTestid="user_service_id"
                  required
                />
              </div>
            </DialogContent>
            <DialogActions className="px-6 py-4 flex justify-end gap-2">
              <div>
                <Button onClick={() => setModal(false)} variant="secondary">
                  {t('downloadTemplateForm.close')}
                </Button>
              </div>
              <div>
                <Button icon={<DownloadCloud />} variant="main" type="submit" disabled={isLoading}>
                  {isLoading && <CircularProgress size={16} className="mr-2" color="inherit" />}
                  {t('downloadTemplateForm.downloadTemplate')}
                </Button>
              </div>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default DownloadTemplateForm;
