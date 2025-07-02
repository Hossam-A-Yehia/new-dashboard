import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Button,
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
  quotationDetails: QuotationDetailsData;
}

const ReplyDetails: React.FC<Props> = ({
  toggle,
  quotationDetails,
}) => {
  const { id: discussionable_id } = useParams<{ id: string }>();

  const notifiableUsers = quotationDetails?.discussionable?.notifiable_users;
  const userStatus = notifiableUsers?.find(
    (user) => user.user_id === String(quotationDetails?.user_id)
  )?.status;

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
          alignItems: 'center'
        }}
      >
        <Typography variant="h5" fontWeight="600">
         { t('Reply details') }
        </Typography>
        <IconButton 
          onClick={toggle}
          sx={{ 
            color: 'text.secondary',
            '&:hover': { color: 'text.primary' }
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
            mb: 3
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
                  borderColor: 'primary.main'
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
                      label={t('Accepted')}
                      color="success"
                      size="small"
                      variant="outlined"
                    />
                  )}
                  {userStatus === 4 && (
                    <Chip
                      label={t('Declined')}
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
            mb: 3
          }}
        >
          <CardContent>
            <Typography variant="subtitle1" fontWeight="600" mb={1}>
              {t('Description')}
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
            mb: 3
          }}
        >
          <CardContent>
            <Typography variant="subtitle1" fontWeight="600" mb={2}>
              {t('Files')}
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
                    {t('Document')} {index + 1}
                  </Button>
                ))}
              </Stack>
            ) : (
              <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
                {t('No files available')}
              </Typography>
            )}
          </CardContent>
        </Card>
        {/* Action Buttons */}
        <Stack 
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ mt: 4 }}
        >
            <Link
              to={`/ask/${discussionable_id}/discussion?receiver_id=${quotationDetails?.user?.id}`}
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
                {t('Discuss')}
              </Button>
            </Link>
          ) 
        </Stack>
      </Box>
    </Box>
  );
};

export default ReplyDetails;
