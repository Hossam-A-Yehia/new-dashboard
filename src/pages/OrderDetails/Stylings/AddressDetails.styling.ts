import { Box, Card, CardHeader, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledCard = styled(Card)(() => ({
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(0, 0, 0, 0.06)',
  overflow: 'hidden',
  background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
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

export const InfoRow = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '8px 0',
  transition: 'all 0.2s ease',
  color: '#4a5568',
  '&:hover': {
    backgroundColor: 'rgba(102, 126, 234, 0.04)',
    borderRadius: '8px',
    paddingLeft: '8px',
  },
}));

export const IconBox = styled(Box)(() => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '24px',
  height: '24px',
  borderRadius: '6px',
  color: '#667eea',
}));

export const InfoText = styled(Typography)(() => ({
  fontWeight: 500,
  fontSize: '1rem',
  fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
}));