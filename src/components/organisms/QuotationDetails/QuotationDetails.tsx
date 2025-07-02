import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Button,
  CircularProgress,
  Avatar,
  Typography,
  Card,
  CardContent,
  Stack,
  Box,
  IconButton,
  Chip,
} from '@mui/material';
import { t } from 'i18next';
import { X, FileText, Calendar, MessageSquare, Download } from 'lucide-react';

// Types for incoming props
interface UserDetail {
  logo: string;
}

interface User {
  id: number;
  user_id: number;
  username: string;
  business_user_detail?: UserDetail;
}

interface File {
  url: string;
}

interface NotifiableUser {
  user_id: string;
  status: number;
}

interface Discussionable {
  notifiable_users?: NotifiableUser[];
  status?: number;
}

interface QuotationDetailsData {
  user_id: number;
  user: User;
  created_at: string;
  details: string;
  files?: File[];
  budget?: number;
  discussionable?: Discussionable;
}

interface Props {
  toggle: () => void;
  isAsk: boolean;
  quotationDetails: QuotationDetailsData;
  onAccept: (userId: number) => void;
  onReject: (userId: number) => void;
  isLoadingAccept: boolean;
  isLoadingDecline: boolean;
}

const QuotationDetails: React.FC<Props> = ({
  toggle,
  isAsk,
  quotationDetails,
  onAccept,
  onReject,
  isLoadingAccept,
  isLoadingDecline,
}) => {
  const { id: discussionable_id } = useParams<{ id: string }>();

  const notifiableUsers = quotationDetails?.discussionable?.notifiable_users;
  const userStatus = notifiableUsers?.find(
    (user) => user.user_id === String(quotationDetails?.user_id),
  )?.status;
  const rfpStatus = quotationDetails?.discussionable?.status;

  return (
    <Box sx={{ bgcolor: 'background.paper' }}>
      {/* Header */}
      <Box
        sx={{
          p: 3,
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h5" fontWeight="600">
          {isAsk ? t('quotations.quotationDetails.replyDetails') : t('quotations.quotationDetails.quotationsDetails')}
        </Typography>
        <IconButton
          onClick={toggle}
          sx={{
            color: 'text.secondary',
            '&:hover': { color: 'text.primary' },
          }}
        >
          <X size={24} />
        </IconButton>
      </Box>

      <Box sx={{ p: 3 }}>
        {/* User Info */}
        <Card
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            mb: 3,
          }}
        >
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                alt={quotationDetails?.user?.username}
                src={quotationDetails?.user?.business_user_detail?.logo}
                sx={{
                  width: 64,
                  height: 64,
                  border: '2px solid',
                  borderColor: 'primary.main',
                }}
              />
              <Box flexGrow={1}>
                <Typography variant="h6" fontWeight="600">
                  {quotationDetails?.user?.username}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center" mt={0.5}>
                  <Chip
                    icon={<Calendar size={16} />}
                    label={quotationDetails?.created_at
                      ?.slice(0, 10)
                      .split('-')
                      .reverse()
                      .join('-')}
                    size="small"
                    variant="outlined"
                  />
                  {userStatus === 3 && (
                    <Chip
                      label={t('quotations.quotationDetails.accepted')}
                      color="success"
                      size="small"
                      variant="outlined"
                    />
                  )}
                  {userStatus === 4 && (
                    <Chip
                      label={t('quotations.quotationDetails.declined')}
                      color="error"
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Description */}
        <Card
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            mb: 3,
          }}
        >
          <CardContent>
            <Typography variant="subtitle1" fontWeight="600" mb={1}>
              {t('quotations.quotationDetails.description')}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {quotationDetails?.details}
            </Typography>
          </CardContent>
        </Card>

        {/* Files */}
        <Card
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            mb: 3,
          }}
        >
          <CardContent>
            <Typography variant="subtitle1" fontWeight="600" mb={2}>
              {t('quotations.quotationDetails.files')}
            </Typography>
            {quotationDetails?.files?.length ? (
              <Stack spacing={1}>
                {quotationDetails.files.map((file, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    startIcon={<FileText size={18} />}
                    endIcon={<Download size={18} />}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    sx={{
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      py: 1,
                    }}
                  >
                    {t('quotations.quotationDetails.document')} {index + 1}
                  </Button>
                ))}
              </Stack>
            ) : (
              <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
                {t('quotations.quotationDetails.noFilesAvailable')}
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Budget Details */}
        {!isAsk && (
          <Card
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              mb: 3,
            }}
          >
            <CardContent>
              <Typography variant="subtitle1" fontWeight="600" mb={1}>
                {t('quotations.quotationDetails.budgetDetails')}
              </Typography>
              <Typography variant="h6" color="primary.main">
                ${quotationDetails?.budget}
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
          {isAsk ? (
            <>
              <Button
                onClick={() => onAccept(quotationDetails.user_id)}
                disabled={isLoadingAccept || rfpStatus === 3 || userStatus === 4}
                variant="contained"
                fullWidth
                startIcon={isLoadingAccept ? <CircularProgress size={16} /> : <MessageSquare size={18} />}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                }}
              >
                {t('quotations.quotationDetails.acceptedQuotation')}
              </Button>

              <Button
                onClick={() => onReject(quotationDetails.user_id)}
                disabled={isLoadingDecline || rfpStatus === 3 || userStatus === 4}
                variant="outlined"
                color="error"
                fullWidth
                startIcon={isLoadingDecline ? <CircularProgress size={16} /> : <X size={18} />}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                }}
              >
                {t('quotations.quotationDetails.declineQuotation')}
              </Button>

              <Link
                to={`/discussion/${discussionable_id}?receiverId=${quotationDetails?.user?.id}&isrfq=true&type=rfq`}
                style={{ textDecoration: 'none', width: '100%' }}
              >
                <Button
                  variant="contained"
                  startIcon={<MessageSquare size={18} />}
                  fullWidth
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                  }}
                >
                  {t('quotations.quotationDetails.discuss')}
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Button
                onClick={() => onAccept(quotationDetails.user_id)}
                disabled={isLoadingAccept || rfpStatus === 3 || userStatus === 4}
                variant="contained"
                fullWidth
                startIcon={isLoadingAccept ? <CircularProgress size={16} /> : <MessageSquare size={18} />}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                }}
              >
                {t('quotations.quotationDetails.acceptedQuotation')}
              </Button>

              <Button
                onClick={() => onReject(quotationDetails.user_id)}
                disabled={isLoadingDecline || rfpStatus === 3 || userStatus === 4}
                variant="outlined"
                color="error"
                fullWidth
                startIcon={isLoadingDecline ? <CircularProgress size={16} /> : <X size={18} />}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                }}
              >
                {t('quotations.quotationDetails.declineQuotation')}
              </Button>

              <Link
                to={`/discussion/${discussionable_id}?receiverId=${quotationDetails?.user?.id}&isrfq=true&type=rfq`}
                style={{ textDecoration: 'none', width: '100%' }}
              >
                <Button
                  variant="contained"
                  startIcon={<MessageSquare size={18} />}
                  fullWidth
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                  }}
                >
                  {t('quotations.quotationDetails.discuss')}
                </Button>
              </Link>
            </>
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default QuotationDetails;
