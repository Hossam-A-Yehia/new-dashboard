import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  IconButton,
  Box,
  Typography,
  Paper,
  Stack,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useMutateAddBulkProduct } from '@/hooks/useProducts';
import Button from '@/components/atoms/Button/Button';
import { DownloadCloud, ShieldCloseIcon, Upload } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

interface FormValues {
  user_id: string;
  file: File | null;
}

interface AddBulkProductProps {
  setModal: (open: boolean) => void;
  toggle: () => void;
  templateModal: boolean;
}

const AddBulkProduct: React.FC<AddBulkProductProps> = ({ templateModal, setModal, toggle }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending: isMutatePutLoading } = useMutateAddBulkProduct();
  const validationBulkSchema = Yup.object({
    file: Yup.mixed()
      .test('fileSize', t('bulkProductUpload.fileTooLarge'), (value) => {
        if (!value) return true;
        const maxSize = 2000 * 1024;
        return value instanceof File ? value.size <= maxSize : false;
      })
      .required(t('bulkProductUpload.fileRequired')),
  });
  const handleSubmit = async (values: FormValues, { resetForm, setErrors }: any) => {
    const formData = new FormData();
    formData.append('file', values.file as File);

    try {
      await mutateAsync(formData);
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(t('bulkProductUpload.successMessage'));
      setModal(false);
      resetForm();
    } catch (err: any) {
      if (err?.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        toast.error(t(err.response.data.message));
      }
    }
  };

  return (
    <Dialog
      open={templateModal}
      onClose={toggle}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <DialogTitle className="text-xl font-semibold border-b pb-4">
        {t('bulkProductUpload.title')}
      </DialogTitle>

      <Formik<FormValues>
        initialValues={{
          user_id: '',
          file: null,
        }}
        validationSchema={validationBulkSchema}
        onSubmit={handleSubmit}
      >
        {(form) => (
          <Form>
            <DialogContent className="space-y-6 py-6">
              {/* Info Alert */}
              <Alert
                severity="info"
                sx={{
                  borderRadius: 2,
                  '& .MuiAlert-icon': { alignItems: 'center' }
                }}
              >
                <Typography variant="body2">
                  <strong>{t("bulkProductUpload.note")}</strong>
                  {t('bulkProductUpload.noteMessage')}
                </Typography>
              </Alert>

              {/* File Upload Area */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  border: '2px dashed',
                  borderColor: form.errors.file ? 'error.main' : 'primary.main',
                  borderRadius: 2,
                  bgcolor: 'background.default',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'primary.dark',
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <Stack spacing={2} alignItems="center">
                  <Upload size={40} color={form.errors.file ? '#d32f2f' : '#1976d2'} />
                  <Typography variant="h6" color="text.secondary">
                    {t('bulkProductUpload.dragAndDropFile')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('bulkProductUpload.or')}
                  </Typography>
                  <Box>
                    <input
                      type="file"
                      id="file"
                      accept=".xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        const file = event.target.files?.[0];
                        if (!form.touched.file) {
                          form.setFieldTouched('file', true);
                        }
                        form.setFieldValue('file', file);
                      }}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="file">
                      <Button
                        variant="outlinePrimary"
                        onClick={() => document.getElementById('file')?.click()}
                        icon={<Upload size={20} />}
                      >
                        {t('bulkProductUpload.chooseFile')}
                      </Button>
                    </label>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {t('bulkProductUpload.supportedFormat')}
                  </Typography>
                </Stack>
              </Paper>

              {/* File Upload Status */}
              {form.values.file && !form?.errors?.file && (
                <Alert
                  severity="success"
                  sx={{
                    borderRadius: 2,
                    '& .MuiAlert-icon': { alignItems: 'center' }
                  }}
                  action={
                    <IconButton
                      size="small"
                      onClick={() => {
                        form.setFieldValue('file', null);
                        form.setFieldTouched('file', false);
                        toast.info(t('File removed.'));
                      }}
                    >
                      <ShieldCloseIcon size={18} />
                    </IconButton>
                  }
                >
                  <Typography variant="body2">
                    <strong>{t('bulkProductUpload.fileUploaded')}:</strong>
                    {(form.values.file as File).name}
                  </Typography>
                </Alert>
              )}

              {/* Error Display */}
              {form.errors.file && (
                <Alert
                  severity="error"
                  sx={{
                    borderRadius: 2,
                    '& .MuiAlert-icon': { alignItems: 'center' }
                  }}
                  icon={<WarningAmberIcon />}
                >
                  <Typography variant="body2">
                    <strong>{t('bulkProductUpload.error')}:</strong>
                    {Array.isArray(form.errors.file) ? form.errors.file[0] : form.errors.file}
                  </Typography>
                </Alert>
              )}
            </DialogContent>

            <DialogActions
              sx={{
                px: 3,
                py: 2,
                borderTop: 1,
                borderColor: 'divider',
                gap: 2
              }}
            >
              <Button
                onClick={() => setModal(false)}
                variant="outlinePrimary"
                additionalClasses="min-w-[100px]"
              >
                {t('bulkProductUpload.cancel')}
              </Button>
              <Button
                icon={<DownloadCloud size={20} />}
                variant="main"
                type="submit"
                disabled={isMutatePutLoading || !form.values.file}
                additionalClasses="min-w-[180px]"
              >
                {isMutatePutLoading ? (
                  <>
                    <CircularProgress size={16} className="mr-2" color="inherit" />
                    {t('bulkProductUpload.uploading')}
                  </>
                ) : (
                  t('bulkProductUpload.uploadProducts')
                )}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default AddBulkProduct;
