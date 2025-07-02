import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Typography,
  Box,
} from '@mui/material';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/atoms/Button/Button';

interface DeleteConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  loading?: boolean;
}

const DeleteConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  loading = false,
}: DeleteConfirmationModalProps) => {
  const { t } = useTranslation();

  const defaultTitle = t('DeleteModal.Confirm_Deletion');
  const defaultMessage = t('common.confirmation.delete_item');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          p: 3,
          borderRadius: 3,
          width: '100%',
          maxWidth: 460,
          textAlign: 'center',
        },
      }}
    >
      <Box display="flex" justifyContent="center" mb={2}>
        <Box
          sx={{
            backgroundColor: '#fff3cd',
            color: '#856404',
            borderRadius: '50%',
            p: 1.5,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AlertTriangle size={32} />
        </Box>
      </Box>

      <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.25rem', mb: 1 }}>{title || defaultTitle}</DialogTitle>

      <DialogContent sx={{ px: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {message || defaultMessage}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', mt: 3 }}>
        <div className="flex items-center gap-3 w-full">
        <Button variant="outlinePrimary" onClick={onClose}>
          {t('common.cancel')}
        </Button>
        <Button variant="delete" onClick={onConfirm} disabled={loading}>
          {t('common.delete')}
        </Button>

        </div>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
