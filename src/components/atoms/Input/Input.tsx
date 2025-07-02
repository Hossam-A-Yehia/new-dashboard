import React from 'react';
import { TextField } from '@mui/material';
import { InputProps } from '@/types/Atoms';

const Input: React.FC<InputProps> = ({
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  name,
  touched,
  errors,
  readOnly,
  onClick,
  disabled,
  onBlur,
}) => {
  return (
    <TextField
      size="small"
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      name={name}
      onBlur={onBlur}
      disabled={disabled}
      InputProps={{
        readOnly: readOnly,
      }}
      onClick={onClick}
      inputProps={{
        'data-testid': id,
      }}
      fullWidth
      variant="outlined"
      error={touched && Boolean(errors)}
      sx={{
        "& input::placeholder": {
          fontSize: "0.85rem",
          color: "black",
          fontWeight:"500"
        },
      }}
    />
  );
};

export default Input;
