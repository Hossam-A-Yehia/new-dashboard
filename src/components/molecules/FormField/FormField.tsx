import React from 'react';
import { useField } from 'formik';
import { IoMdWarning } from 'react-icons/io';
import { FormFieldProps } from '@/types/Molecules';
import Input from '@/components/atoms/Input/Input.tsx';
import Label from '@/components/atoms/Label/Label.tsx';
import { Box, Typography } from '@mui/material';

const FormField: React.FC<FormFieldProps> = ({
  id,
  type = 'text',
  required,
  placeholder,
  name,
  label,
  readOnly,
  onClick,
  value,
  disabled,
  dataTestid,
  errors,
  touched,
  onBlur,
  additionalClasses
}) => {
  const [field] = useField(name);

  return (
    <div  data-testid={dataTestid} className={`mb-2 ${additionalClasses}`}>
      {label && (
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
      )}
      <Box sx={{ position: 'relative', mt: 1 }}>
        <Input
          {...field}
          id={id}
          onBlur={onBlur}
          type={type}
          required={required}
          placeholder={placeholder}
          touched={touched}
          errors={errors}
          readOnly={readOnly}
          onClick={onClick}
          value={value}
          disabled={disabled}
        />
      </Box>
      {errors && touched && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            pt: 0.2,
            color: 'error.main',
          }}
        >
          <IoMdWarning
            style={{ fontSize: '0.75rem', marginRight: '0.5rem' }}
            data-testid="warning-icon"
          />
          <Typography variant="caption" sx={{ fontWeight: 'medium' }}>
            {errors}
          </Typography>
        </Box>
      )}
    </div>
  );
};

export default FormField;
