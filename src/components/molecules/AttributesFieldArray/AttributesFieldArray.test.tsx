import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Formik } from 'formik';
import AttributesFieldArray from './AttributesFieldArray';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {
      language: 'en',
    },
  }),
}));

describe('AttributesFieldArray', () => {
  const mockAttributes = [
    {
      id: '1',
      value: 'TEXT',
      type: 'text',
      name_en: 'Test Attribute',
      name_ar: 'اختبار السمة',
    },
    {
      id: '2',
      value: 'SELECT_BOX',
      type: 'select',
      name_en: 'Select Attribute',
      name_ar: 'اختر السمة',
      values: [
        { en: 'Option 1', ar: 'الخيار 1' },
        { en: 'Option 2', ar: 'الخيار 2' },
      ],
    },
  ];

  const defaultProps = {
    form: {
      values: {
        attributes: [],
      },
      touched: {},
      errors: {},
    },
    isMutatePutLoading: false,
    attributes: mockAttributes,
    isOptional: false,
  };

  const renderComponent = (props = {}) => {
    return render(
      <Formik
        initialValues={{ attributes: [] }}
        onSubmit={() => {}}
      >
        <AttributesFieldArray {...defaultProps} {...props} />
      </Formik>
    );
  };

  it('renders text input fields for TEXT type attributes', () => {
    renderComponent();
    expect(screen.getByLabelText(/Test Attribute - EN/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Test Attribute - AR/i)).toBeInTheDocument();
  });


  it('disables fields when isMutatePutLoading is true', () => {
    renderComponent({ isMutatePutLoading: true });
    const textField = screen.getByLabelText(/Test Attribute - EN/i);
    expect(textField).toBeDisabled();
  });

  it('shows validation errors for required fields', async () => {
    renderComponent();
    const textField = screen.getByLabelText(/Test Attribute - EN/i);
    
    // Trigger blur without entering value
    fireEvent.blur(textField);
    
    // Check for error message
    expect(await screen.findByText(/Attribute value is required/i)).toBeInTheDocument();
  });

  it('handles optional fields correctly when isOptional is true', () => {
    renderComponent({ isOptional: true });
    const textField = screen.getByLabelText(/Test Attribute - EN/i);
    
    // Trigger blur without entering value
    fireEvent.blur(textField);
    
    // Should not show required error
    expect(screen.queryByText(/Attribute value is required/i)).not.toBeInTheDocument();
  });

  it('validates URL format for URL type attributes', async () => {
    const urlAttribute = {
      id: '4',
      value: 'URL',
      type: 'url',
      name_en: 'Website URL',
      name_ar: 'رابط الموقع',
    };

    renderComponent({ attributes: [urlAttribute] });
    
    const urlInput = screen.getByLabelText(/Website URL/i);
    
    // Enter invalid URL
    fireEvent.change(urlInput, { target: { value: 'invalid-url' } });
    fireEvent.blur(urlInput);
    
    // Check for URL validation error
    expect(await screen.findByText(/Please enter a valid URL!/i)).toBeInTheDocument();
  });
}); 