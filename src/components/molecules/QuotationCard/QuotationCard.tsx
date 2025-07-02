import React from 'react';
import { t } from 'i18next';
import {
  CircularProgress,
  Button,
  Avatar,
  Typography,
  Card,
  CardContent,
  Stack,
  Box,
} from '@mui/material';

interface UserDetail {
  logo: string;
}

interface User {
  id: number;
  user_id: number;
  username: string;
  business_user_detail?: UserDetail;
}

interface DiscussionableUser {
  user_id: string;
  status: number;
}

interface Discussionable {
  notifiable_users?: DiscussionableUser[];
  status?: number;
}

interface QuotationData {
  id: number;
  user_id: number;
  user: User;
  created_at: string;
  discussionable?: Discussionable;
}

interface Props {
  data: QuotationData;
  onAccept: (userId: number) => void;
  onReject: (userId: number) => void;
  setModal: (value: boolean) => void;
  isAsk: boolean;
  setQuotationDetails: (data: QuotationData) => void;
  isLoadingAccept: boolean;
  isLoadingDecline: boolean;
  requestId?: number;
}

const QuotationCard: React.FC<Props> = ({
  data,
  onAccept,
  onReject,
  setModal,
  isAsk,
  setQuotationDetails,
  isLoadingAccept,
  isLoadingDecline,
  requestId,
}) => {
  const handleViewDetails = () => {
    setModal(true);
    setQuotationDetails(data);
  };

  const notifiableUsers = data?.discussionable?.notifiable_users;
  const userStatus = notifiableUsers?.find(
    (user) => user.user_id === String(data?.user_id)
  )?.status;
  const rfpStatus = data?.discussionable?.status;

  const isDeclined = requestId === data.id && userStatus === 4;
  const isAccepted = requestId === data.id && userStatus === 3;

  return (
    <Card className="mb-3" sx={{ backgroundColor: '#f5f5f5' }}>
      <CardContent>
        {/* Header */}
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Avatar
            alt={data.user?.username}
            src={data.user?.business_user_detail?.logo}
            sx={{ width: 50, height: 50 }}
          />
          <Box flexGrow={1}>
            <Typography variant="h6">
              {data.user?.username}
            </Typography>
            <Stack direction="row" spacing={2} mt={0.5} alignItems="center">
              <Typography variant="body2" color="text.secondary">
                {data.created_at?.slice(0, 10).split('-').reverse().join('-')}
              </Typography>
              {isDeclined && (
                <Typography variant="body2" color="error" fontWeight="bold">
                  {t('quotations.quotationCard.requestDeclined')}
                </Typography>
              )}
              {isAccepted && (
                <Typography variant="body2" color="success.main" fontWeight="bold">
                  {t('quotations.quotationCard.requestAccepted')}
                </Typography>
              )}
            </Stack>
            {!isAsk && (
              <Typography
                variant="body2"
                color="primary"
                sx={{ mt: 1, cursor: 'pointer', textDecoration: 'underline', fontWeight: 500 }}
                onClick={handleViewDetails}
              >
                {t('quotations.quotationCard.viewDetails')}
              </Typography>
            )}
          </Box>
        </Stack>

        {/* Action Buttons */}
        <Box mt={2}>
          {isAsk ? (
            <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: '#f05b20',
                '&:hover': { backgroundColor: '#e74200' },
              }}
              onClick={handleViewDetails}
            >
              {t('quotations.quotationCard.viewReply')}
            </Button>
          ) : (
            <Stack direction="row" spacing={2}>
              <Button
                onClick={() => onAccept(data.user_id)}
                disabled={isLoadingAccept || rfpStatus === 3 || isDeclined}
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: '#f05b20',
                  '&:hover': { backgroundColor: '#e74200' },
                }}
              >
                {isLoadingAccept && (
                  <CircularProgress size={14} sx={{ color: 'white', mr: 1 }} />
                )}
                {t('quotations.quotationCard.accepted')}
              </Button>

              <Button
                onClick={() => onReject(data.user_id)}
                disabled={isLoadingDecline || rfpStatus === 3 || isDeclined}
                variant="outlined"
                fullWidth
                color="error"
              >
                {isLoadingDecline && (
                  <CircularProgress size={14} sx={{ mr: 1 }} />
                )}
                {t('quotations.quotationCard.declined')}
              </Button>
            </Stack>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default QuotationCard;
