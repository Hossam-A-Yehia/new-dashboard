import { render, screen } from '@testing-library/react';
import { Formik, Form } from 'formik';
import FormField from './FormField';
import '@testing-library/jest-dom';
import { describe, expect, it } from 'vitest';

interface FormFieldProps {
  id: string;
  name: string;
  label: string;
  type: string;
  required: boolean;
  placeholder: string;
  errors: string;
  touched: boolean;
}

describe('FormField Component', () => {
  const renderFormField = (props: FormFieldProps) => {
    render(
      <Formik initialValues={{ [props.name]: '' }} onSubmit={() => {}}>
        <Form>
          <FormField {...props} />
        </Form>
      </Formik>,
    );
  };

  it('renders the label if provided', () => {
    renderFormField({
      id: 'email',
      name: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      placeholder: 'Enter your email',
      errors: '',
      touched: false,
    });

    expect(screen.getByText('Email Address')).toBeInTheDocument();
  });

  it('renders the input field with the correct props', () => {
    renderFormField({
      id: 'email',
      name: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      placeholder: 'Enter your email',
      errors: '',
      touched: false,
    });

    const input = screen.getByPlaceholderText('Enter your email');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toBeRequired();
  });

  it('displays an error message when errors and touched are true', () => {
    renderFormField({
      id: 'email',
      name: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      placeholder: 'Enter your email',
      errors: 'Invalid email address',
      touched: true,
    });

    expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    expect(screen.getByTestId('warning-icon')).toBeInTheDocument();
  });

  it('does not display an error message if touched is false', () => {
    renderFormField({
      id: 'email',
      name: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      placeholder: 'Enter your email',
      errors: 'Invalid email address',
      touched: false,
    });

    expect(screen.queryByText('Invalid email address')).not.toBeInTheDocument();
  });

  it('does not display an error message if errors is an empty string', () => {
    renderFormField({
      id: 'email',
      name: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      placeholder: 'Enter your email',
      errors: '',
      touched: true,
    });

    expect(screen.queryByText('Invalid email address')).not.toBeInTheDocument();
  });
});
