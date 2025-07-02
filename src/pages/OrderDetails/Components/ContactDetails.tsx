import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import MailIcon from '@mui/icons-material/Mail';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import { Box,Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { StyledCard, StyledCardHeader, ContactItem, HeaderAvatar, NameIconWrapper, EmailIconWrapper, PhoneIconWrapper, ContactLink } from '../Stylings/ContactDetails.styles';

interface ContactDetailsProps {
  name: string;
  email?: string;
  phone?: string;
  title: string;
}

export const ContactDetails = ({ name, email, phone, title }: ContactDetailsProps) => {
const { t } = useTranslation();
  
 
  return (
    <StyledCard>
      <StyledCardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', zIndex: 1 }}>
            <HeaderAvatar>
              {title === 'Supplier' ? <BusinessIcon fontSize="small" /> : <PersonIcon fontSize="small" />}
            </HeaderAvatar>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                fontSize: '1.1rem',
                fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif'
              }}
            >
              {t(`${title} Details`)}
            </Typography>
          </Box>
        }
      />
      
      <CardContent sx={{ padding: '24px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Name Section */}
          <ContactItem>
            <NameIconWrapper>
              <PersonIcon fontSize="medium" />
            </NameIconWrapper>
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  color: '#2d3748',
                  mb: 0.5,
                  fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif'
                }}
              >
                {name || 'N/A'}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#718096',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  textTransform: 'capitalize'
                }}
              >
                {t(title)}
              </Typography>
            </Box>
          </ContactItem>

          {(email || phone) && <Divider sx={{ my: 1, opacity: 0.6 }} />}

          {/* Email Section */}
          {email && (
            <ContactItem>
              <EmailIconWrapper>
                <MailIcon fontSize="medium" />
              </EmailIconWrapper>
              <Box sx={{ flex: 1 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#718096',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    mb: 0.5,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  {t('Email')}
                </Typography>
                <ContactLink href={`mailto:${email}`}>
                  {email}
                </ContactLink>
              </Box>
            </ContactItem>
          )}

          {/* Phone Section */}
          {phone && (
            <ContactItem>
              <PhoneIconWrapper>
                <PhoneIcon fontSize="medium" />
              </PhoneIconWrapper>
              <Box sx={{ flex: 1 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#718096',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    mb: 0.5,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  {t('Phone')}
                </Typography>
                <ContactLink href={`tel:${phone}`}>
                  {phone}
                </ContactLink>
              </Box>
            </ContactItem>
          )}
        </Box>
      </CardContent>
    </StyledCard>
  );
};