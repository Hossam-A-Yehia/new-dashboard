import { Box, Typography } from '@mui/material';
import { FiXCircle as XCircle } from 'react-icons/fi';
import { t } from 'i18next';

const ErrorState = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      py: 8,
      flexDirection: 'column',
      gap: 2,
      color: '#dc3545',
    }}
  >
    <XCircle size={48} />
    <Typography variant="h6" color="error">
      {t("Error loading details")}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {t("Please try refreshing the page")}
    </Typography>
  </Box>
);

export default ErrorState;
