import CardContent from '@mui/material/CardContent';
import {Box, Typography } from '@mui/material';

import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import PublicIcon from '@mui/icons-material/Public';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { t } from "i18next";
import { IconBox, InfoRow, InfoText, StyledCard, StyledCardHeader } from '../Stylings/AddressDetails.styling';

interface Address {
  street: string;
  city: string;
  zip: string;
  country: string;
}

interface AddressDetailsProps {
  name: string;
  phone?: string;
  address: Address;
}

export const AddressDetails = ({ name, phone, address }: AddressDetailsProps) => (
  <StyledCard>
    <StyledCardHeader
      title={
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LocationOnIcon sx={{ mr: 1.5, fontSize: '1.5rem' }} />
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700,
              fontSize: '1.2rem',
              fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif'
            }}
          >
            {t("Order Address")}
          </Typography>
        </Box>
      }
    />
    <CardContent sx={{ padding: '24px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <InfoRow>
          <IconBox>
            <PersonIcon />
          </IconBox>
          <InfoText>{name}</InfoText>
        </InfoRow>
        {phone && (
          <InfoRow>
            <IconBox>
              <PhoneIcon />
            </IconBox>
            <InfoText>{phone}</InfoText>
          </InfoRow>
        )}
        <InfoRow>
          <IconBox>
            <HomeIcon />
          </IconBox>
          <InfoText>{address.street}</InfoText>
        </InfoRow>
        <InfoRow>
          <IconBox>
            <LocationOnIcon />
          </IconBox>
          <InfoText>{address.city} - {address.zip}</InfoText>
        </InfoRow>
        <InfoRow>
          <IconBox>
            <PublicIcon />
          </IconBox>
          <InfoText>{address.country}</InfoText>
        </InfoRow>
      </Box>
    </CardContent>
  </StyledCard>
);
