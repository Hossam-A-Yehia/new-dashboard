import React from 'react';
import { Button as MuiButton } from '@mui/material';
import { ButtonProps } from '@/types/Atoms';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const Button: React.FC<ButtonProps> = ({
  onClick,
  disabled,
  variant = 'primary',
  loading = false,
  children,
  type,
  additionalClasses = '',
  dataTestid,
  icon,
  iconPosition = 'start',
}) => {
const getVariantStyles = () => {
  switch (variant) {
    case 'main':
      return {
        backgroundColor: '#f05b20',
        color: '#fff',
        '&:hover': { backgroundColor: '#e74200' },
        '&:disabled': {
          backgroundColor: '#f05b20',
          opacity: 0.5,
          color: 'white',
          cursor: 'not-allowed',
        },
      };
    case 'primary':
      return {
        backgroundColor: 'primary.main',
        color: 'white',
        '&:hover': { backgroundColor: 'primary.dark' },
        '&:disabled': { backgroundColor: 'primary.main', opacity: 0.5 },
      };
    case 'secondary':
      return {
        backgroundColor: '#f3f6f9',
        color: 'black',
        '&:hover': { backgroundColor: '#cfd1d4' },
        '&:disabled': { backgroundColor: '#f3f6f9', opacity: 0.5 },
      };
    case 'outlinePrimary':
      return {
        border: '1px solid',
        borderColor: 'primary.main',
        color: 'primary.main',
        backgroundColor: 'white',
        '&:hover': { backgroundColor: 'primary.light', color: 'white' },
        '&:disabled': { opacity: 0.5 },
      };
    case 'outlineMain':
      return {
        border: '1px solid',
        borderColor: '#f05b20',
        color: '#f05b20',
        backgroundColor: 'white',
        '&:hover': { backgroundColor: '#f05b20', color: 'white' },
        '&:disabled': { opacity: 0.5 },
      };
    case 'delete':
      return {
        backgroundColor: 'error.main',
        color: 'white',
        '&:hover': { backgroundColor: 'error.dark' },
        '&:disabled': { backgroundColor: 'error.main', opacity: 0.5 },
      };
    case 'delete-outline':
      return {
        border: '1px solid',
        borderColor: 'error.main',
        color: 'error.main',
        backgroundColor: 'transparent',
        '&:hover': {
          backgroundColor: 'error.main',
          color: 'white',
        },
        '&:disabled': {
          borderColor: 'error.main',
          color: 'error.main',
          opacity: 0.5,
        },
      };
    case 'edit':
      return {
        backgroundColor: 'info.main',
        color: 'white',
        '&:hover': { backgroundColor: 'info.dark' },
        '&:disabled': { backgroundColor: 'info.main', opacity: 0.5 },
      };
    case 'success':
      return {
        backgroundColor: 'success.main',
        color: 'white',
        '&:hover': { backgroundColor: 'success.dark' },
        '&:disabled': { backgroundColor: 'success.main', opacity: 0.5 },
      };
    case 'outlineSuccess':
      return {
        border: '1px solid',
        borderColor: 'success.main',
        color: 'success.main',
        backgroundColor: 'white',
        '&:hover': { backgroundColor: 'success.light', color: 'white' },
        '&:disabled': {
          borderColor: 'success.main',
          color: 'success.main',
          opacity: 0.5,
        },
      };
    default:
      return {};
  }
};

  return (
    <MuiButton
      data-testid={dataTestid}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={additionalClasses}
      fullWidth
      sx={{
        textTransform: 'none',
        py: 1,
        px: 2,
        borderRadius: '0.375rem',
        transition: 'all 300ms',
        whiteSpace: 'nowrap',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...(loading && { opacity: 0.75, cursor: 'not-allowed' }),
        ...getVariantStyles(),
        '& .MuiButton-startIcon': { marginRight: 1, marginLeft: 0 },
        '& .MuiButton-endIcon': { marginLeft: 1, marginRight: 0 },
      }}
    >
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {icon && iconPosition === 'start' && (
            <span style={{ display: 'inherit', marginRight: 8 }}>{icon}</span>
          )}
          {children}
          {icon && iconPosition === 'end' && (
            <span style={{ display: 'inherit', marginLeft: 8 }}>{icon}</span>
          )}
        </>
      )}
    </MuiButton>
  );
};

export default Button;
