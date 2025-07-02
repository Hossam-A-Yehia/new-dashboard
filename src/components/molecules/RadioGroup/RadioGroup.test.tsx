import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Formik, Form } from 'formik';
import RadioGroup from './RadioGroup';

vi.mock('@/components/atoms/Label/Label', () => ({
  default: ({ children, htmlFor, required }: { children: React.ReactNode; htmlFor: string; required: boolean }) => (
    <label htmlFor={htmlFor} data-required={required}>
      {children}
    </label>
  ),
}));

vi.mock('react-icons/io', () => ({
  IoMdWarning: () => <span>WarningIcon</span>,
}));

describe('RadioGroup', () => {
  const options = [
    { value: 1, label: 'Option 1' },
    { value: 2, label: 'Option 2' },
    { value: 3, label: 'Option 3' },
  ];

  const defaultProps = {
    options,
    name: 'testRadio',
    selectedValue: 1,
    label: undefined as string | undefined,
    error: undefined as string | undefined,
    touched: undefined as boolean | undefined,
    required: false,
  };

  const renderWithFormik = (props = defaultProps, initialValues = { testRadio: 1 }) => {
    return render(
      <Formik initialValues={initialValues} onSubmit={vi.fn()}>
        <Form>
          <RadioGroup {...props} />
        </Form>
      </Formik>
    );
  };

  it('renders the component with default props', () => {
    renderWithFormik();
    const radioGroup = screen.getByTestId('testRadio');
    expect(radioGroup).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('renders the label when provided', () => {
    renderWithFormik({ ...defaultProps, label: 'Test Label', required: true });
    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('data-required', 'true');
  });

  it('renders all radio options with correct labels and checked state', () => {
    renderWithFormik();
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(3);
    options.forEach((option, index) => {
      const radio = radios[index];
      const label = screen.getByText(option.label);
      expect(radio).toHaveAttribute('id', String(option.value));
      expect(radio).toHaveAttribute('value', String(option.value));
      expect(label).toBeInTheDocument();
      if (option.value === 1) {
        expect(radio).toBeChecked();
      } else {
        expect(radio).not.toBeChecked();
      }
    });
  });

  it('updates Formik field value when a radio button is selected', () => {
    renderWithFormik();
    const radio = screen.getByRole('radio', { name: 'Option 2' });
    fireEvent.click(radio);
    expect(radio).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Option 1' })).not.toBeChecked();
  });

  it('displays error message when error and touched are set', () => {
    renderWithFormik({ ...defaultProps, error: 'Required field', touched: true });
    const errorMessage = screen.getByText('Required field');
    expect(errorMessage).toBeInTheDocument();
    expect(screen.getByText('WarningIcon')).toBeInTheDocument();
  });

  it('does not display error message when error is missing', () => {
    renderWithFormik({ ...defaultProps, error: undefined, touched: true });
    expect(screen.queryByText('WarningIcon')).not.toBeInTheDocument();
  });

  it('does not display error message when touched is false', () => {
    renderWithFormik({ ...defaultProps, error: 'Required field', touched: false });
    expect(screen.queryByText('Required field')).not.toBeInTheDocument();
    expect(screen.queryByText('WarningIcon')).not.toBeInTheDocument();
  });
});