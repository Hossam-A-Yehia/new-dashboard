import React from 'react';
import { t } from 'i18next';
import {
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
  setModal: (value: boolean) => void;
  setQuotationDetails: (data: QuotationData) => void;
}

const ReplyCard: React.FC<Props> = ({
  data,
  setModal,
  setQuotationDetails,
}) => {
  const handleViewDetails = () => {
    setModal(true);
    setQuotationDetails(data);
  };

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
            <Typography variant="h6">{data.user?.username}</Typography>
            <Stack direction="row" spacing={2} mt={0.5} alignItems="center">
              <Typography variant="body2" color="text.secondary">
                {data.created_at?.slice(0, 10).split('-').reverse().join('-')}
              </Typography>
            </Stack>
              <Typography
                variant="body2"
                color="primary"
                sx={{ mt: 1, cursor: 'pointer', textDecoration: 'underline', fontWeight: 500 }}
                onClick={handleViewDetails}
              >
                {t('View details')}
              </Typography>
          </Box>
        </Stack>

        {/* Action Buttons */}
        <Box mt={2}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: '#f05b20',
                '&:hover': { backgroundColor: '#e74200' },
              }}
              onClick={handleViewDetails}
            >
              {t('View Reply')}
            </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ReplyCard;
