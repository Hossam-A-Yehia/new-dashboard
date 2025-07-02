import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { t } from 'i18next';
import UpdateBusinessTemplate from './UpdateBusinessTemplate';
import { useBusinessForm } from '@/hooks/useBusinessForm';

vi.mock('@/hooks/useBusinessForm');
vi.mock('react-toastify', () => ({
  toast: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));
vi.mock('i18next', () => ({
  t: vi.fn((key) => key),
}));

vi.mock('@/components/organisms/BusinessDetailsSection/BusinessDetailsSection', () => ({
  BusinessDetailsSection: ({
    setFieldValue,
    setFieldTouched,
    values,
    errors,
    touched,
  }: {
    setFieldValue: (field: string, value: any) => void;
    setFieldTouched: (field: string, isTouched: boolean) => void;
    values: { [key: string]: any };
    errors: { [key: string]: string | undefined };
    touched: { [key: string]: boolean | undefined };
    countryOptions: { value: string; label: string }[];
    cityOptions: { value: string; label: string }[];
  }) => (
    <div>
      <input
        data-testid="business_name"
        value={values.business_name}
        onChange={(e) => setFieldValue('business_name', e.target.value)}
        onBlur={() => setFieldTouched('business_name', true)}
      />
      <input
        data-testid="business_email"
        value={values.business_email}
        onChange={(e) => setFieldValue('business_email', e.target.value)}
        onBlur={() => setFieldTouched('business_email', true)}
      />
      <input
        data-testid="business_des"
        value={values.business_des}
        onChange={(e) => setFieldValue('business_des', e.target.value)}
        onBlur={() => setFieldTouched('business_des', true)}
      />
      {errors.business_name && touched.business_name && (
        <div data-testid="error-business_name">{errors.business_name}</div>
      )}
      {errors.business_email && touched.business_email && (
        <div data-testid="error-business_email">{errors.business_email}</div>
      )}
      {errors.business_des && touched.business_des && (
        <div data-testid="error-business_des">{errors.business_des}</div>
      )}
    </div>
  ),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const mockUseBusinessForm = {
  initialValues: {
    business_name: 'Test Business',
    business_email: 'test@business.com',
    business_des: 'This is a test business description',
    country_id: '1',
    city_id: '1',
  },
  isMutatePutLoading: false,
  countryOptions: [{ value: '1', label: 'Country 1' }],
  cityOptions: [{ value: '1', label: 'City 1' }],
  mutateAsync: vi.fn(),
  userId: '123',
  isLoading: false,
};

describe('UpdateBusinessTemplate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useBusinessForm as any).mockReturnValue(mockUseBusinessForm);
    vi.mocked(t as any).mockImplementation((key: any) => key);
  });

  it('renders loader when isLoading is true', () => {
    vi.mocked(useBusinessForm as any).mockReturnValue({
      ...mockUseBusinessForm,
      isLoading: true,
    });

    render(<UpdateBusinessTemplate />, { wrapper });

    expect(screen.getByTestId('loader-container')).toBeInTheDocument();
  });

  it('renders form when isLoading is false', () => {
    render(<UpdateBusinessTemplate />, { wrapper });

    expect(screen.getByTestId('business_name')).toBeInTheDocument();
    expect(screen.getByTestId('business_email')).toBeInTheDocument();
    expect(screen.getByTestId('business_des')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'update_business_info.update' })).toBeInTheDocument();
  });

  it('displays validation errors when form fields are invalid', async () => {
    render(<UpdateBusinessTemplate />, { wrapper });

    const businessNameInput = screen.getByTestId('business_name');
    const businessEmailInput = screen.getByTestId('business_email');
    const businessDesInput = screen.getByTestId('business_des');
    const submitButton = screen.getByRole('button', { name: 'update_business_info.update' });

    fireEvent.change(businessNameInput, { target: { value: '' } });
    fireEvent.blur(businessNameInput);
    fireEvent.change(businessEmailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(businessEmailInput);
    fireEvent.change(businessDesInput, { target: { value: 'short' } });
    fireEvent.blur(businessDesInput);

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('error-business_name')).toHaveTextContent('Business name is required');
      expect(screen.getByTestId('error-business_email')).toHaveTextContent('Invalid email format');
      expect(screen.getByTestId('error-business_des')).toHaveTextContent(
        'Business description must be at least 10 characters long',
      );
    });
  });

  it('submits form with changed fields and shows success toast', async () => {
    const mutateAsync = vi.fn().mockResolvedValue({});
    vi.mocked(useBusinessForm as any).mockReturnValue({
      ...mockUseBusinessForm,
      mutateAsync,
    });

    render(<UpdateBusinessTemplate />, { wrapper });

    const businessNameInput = screen.getByTestId('business_name');
    const submitButton = screen.getByRole('button', { name: 'update_business_info.update' });

    fireEvent.change(businessNameInput, { target: { value: 'Updated Business' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith({
        userData: { business_name: 'Updated Business' },
        userId: '123',
      });
      expect(toast.info).toHaveBeenCalled();
    });
  });

  it('handles form submission error and shows error toast', async () => {
    const errorMessage = 'Submission failed';
    const mutateAsync = vi.fn().mockRejectedValue({
      response: { data: { message: errorMessage } },
    });
    vi.mocked(useBusinessForm as any).mockReturnValue({
      ...mockUseBusinessForm,
      mutateAsync,
    });

    render(<UpdateBusinessTemplate />, { wrapper });

    const businessNameInput = screen.getByTestId('business_name');
    const submitButton = screen.getByRole('button', { name: 'update_business_info.update' });

    fireEvent.change(businessNameInput, { target: { value: 'Updated Business' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });

});