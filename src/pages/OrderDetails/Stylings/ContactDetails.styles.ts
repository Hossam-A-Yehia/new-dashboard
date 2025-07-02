import { Card, CardHeader, Box, Avatar} from '@mui/material';
import { styled } from '@mui/material/styles';


export const StyledCard = styled(Card)(() => ({
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(0, 0, 0, 0.06)',
  overflow: 'hidden',
  background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15)',
  },
}));

export const StyledCardHeader = styled(CardHeader)(() => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: '20px 24px',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
    pointerEvents: 'none',
  },
  '& .MuiCardHeader-content': {
    position: 'relative',
    zIndex: 1,
  },
}));

export const ContactItem = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  padding: '16px 0',
  borderRadius: '12px',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(102, 126, 234, 0.04)',
    transform: 'translateX(4px)',
  },
}));

export const IconWrapper = styled(Box)(() => ({
  width: '48px',
  height: '48px',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: '16px',
  transition: 'all 0.3s ease',
}));

export const NameIconWrapper = styled(IconWrapper)(() => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
}));

export const EmailIconWrapper = styled(IconWrapper)(() => ({
  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  color: 'white',
  boxShadow: '0 4px 12px rgba(245, 87, 108, 0.3)',
}));

export const PhoneIconWrapper = styled(IconWrapper)(() => ({
  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  color: 'white',
  boxShadow: '0 4px 12px rgba(79, 172, 254, 0.3)',
}));

export const ContactLink = styled('a')(() => ({
  color: '#2d3748',
  textDecoration: 'none',
  fontSize: '1rem',
  fontWeight: 500,
  transition: 'all 0.2s ease',
  '&:hover': {
    color: '#667eea',
    textDecoration: 'underline',
  },
}));

export const HeaderAvatar = styled(Avatar)(() => ({
  width: '32px',
  height: '32px',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  marginRight: '12px',
  border: '2px solid rgba(255, 255, 255, 0.3)',
}));