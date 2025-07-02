import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Formik, Form } from 'formik';
import MultiSelectInput from './MultiSelectInput';

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

vi.mock('react-select', () => ({
  default: ({ options, onChange, ...props }: { options: any[]; onChange: (selectedOptions: any[]) => void; } & React.SelectHTMLAttributes<HTMLSelectElement>) => {
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedValues = Array.from(event.target.selectedOptions).map(
        (option) => option.value
      );
      const selectedOptions = options.filter((opt: any) =>
        selectedValues.includes(opt.value.toString())
      );
      onChange(selectedOptions);
    };
    return (
      <select multiple {...props} onChange={handleChange} data-testid="react-select">
        {options.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  },
}));

describe('MultiSelectInput', () => {
  const options = [
    { value: 1, label: 'Option 1' },
    { value: 2, label: 'Option 2' },
    { value: 3, label: 'Option 3' },
  ];

  const defaultProps = {
    id: 'testSelect',
    name: 'testSelect',
    label: '',
    options,
    value: undefined,
    placeholder: 'Select an option',
    required: false,
    error: undefined as string | undefined,
    touched: undefined as boolean | undefined,
    disabled: false,
    loading: false,
    targetID: false,
  };

  const renderWithFormik = (props = defaultProps, initialValues = { testSelect: [] }) => {
    return render(
      <Formik initialValues={initialValues} onSubmit={vi.fn()}>
        <Form>
          <MultiSelectInput {...props} />
        </Form>
      </Formik>
    );
  };

  it('renders the component with default props', () => {
    renderWithFormik();
    const selectContainer = screen.getByTestId('testSelect');
    expect(selectContainer).toBeInTheDocument();
    const select = screen.getByTestId('react-select');
    expect(select).toBeInTheDocument();
    expect(select).toHaveAttribute('id', 'testSelect');
  });

  it('renders the label when provided', () => {
    renderWithFormik({ ...defaultProps, label: 'Test Label', required: true });
    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('data-required', 'true');
  });

  it('renders Select with correct props', () => {
    renderWithFormik({ ...defaultProps, disabled: true, loading: true, placeholder: 'Custom Placeholder' });
    const select = screen.getByTestId('react-select');
    expect(select).toHaveAttribute('placeholder', 'Custom Placeholder');
    options.forEach((option) => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
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