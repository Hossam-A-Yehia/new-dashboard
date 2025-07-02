import { Box, Card, CardHeader, Chip, Typography } from "@mui/material";
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

export const SummaryRow = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 0',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(102, 126, 234, 0.04)',
    borderRadius: '8px',
    padding: '12px 8px',
    margin: '0 -8px',
  },
}));

export const TotalRow = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '20px 16px',
  margin: '16px -16px -16px -16px',
  background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
  borderRadius: '16px 16px 0 0',
  border: '2px solid #e2e8f0',
  borderBottom: 'none',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '60px',
    height: '4px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '2px',
  },
}));

export const PriceDisplay = styled(Typography)(() => ({
  fontWeight: 700,
  fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
  color: '#2d3748',
}));

export const TotalPriceDisplay = styled(Typography)(() => ({
  fontWeight: 800,
  fontSize: '1.5rem',
  fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textShadow: '0 2px 4px rgba(102, 126, 234, 0.1)',
}));

export const IconWrapper = styled(Box)(() => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '24px',
  height: '24px',
  borderRadius: '6px',
  marginRight: '8px',
}));

export const DateChip = styled(Chip)(() => ({
  backgroundColor: '#e6fffa',
  color: '#234e52',
  fontWeight: 600,
  fontSize: '0.875rem',
  border: '1px solid #b2f5ea',
  '& .MuiChip-icon': {
    color: '#2c7a7b',
  },
}));
