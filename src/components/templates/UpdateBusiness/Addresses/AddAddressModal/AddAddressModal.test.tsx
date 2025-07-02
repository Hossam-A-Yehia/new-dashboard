import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AddAddressModal from './AddAddressModal';
import { useDisclosure } from '@/hooks/useDisclosure';
import { useCountryData } from '@/hooks/useCountryData';
import { useMutateAddAddress } from '@/hooks/useAddress';

vi.mock('@/hooks/useCountryData', () => ({
  useCountryData: vi.fn(),
}));
vi.mock('@/hooks/useAddress', () => ({
  useMutateAddAddress: vi.fn(),
}));
vi.mock('@/hooks/useDisclosure', () => ({
  useDisclosure: vi.fn(),
}));
vi.mock('react-toastify', () => ({
  toast: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

i18n.use(initReactI18next).init({
  lng: 'en',
  resources: {
    en: {
      translation: {
        'Add Address': 'Add Address',
        'business_profile_form.basic_form.location': 'Location',
        'add_address.address_title': 'Address Title',
        'add_address.address_title_placeholder': 'Enter address title',
        'add_address.phone': 'Phone',
        'add_address.phone_placeholder': 'Enter phone',
        'add_address.email': 'Email',
        'add_address.email_placeholder': 'Enter email',
        'add_address.special_instructions': 'Special Instructions',
        'add_address.street_address': 'Street Address',
        'add_address.street_address_placeholder': 'Enter street address',
        'add_address.country': 'Country',
        'add_address.country_placeholder': 'Select a country',
        'add_address.city': 'City',
        'add_address.city_placeholder': 'Select a city',
        'add_address.post_code': 'Post Code',
        'add_address.post_code_placeholder': 'Enter post code',
        'add_address.add_addres_btn': 'Add Address',
        'business_profile_form.basic_form.business_location': 'Business Location',
        'business_profile_form.shared.save': 'Save',
        'Address Added Successfully!': 'Address Added Successfully!',
      },
    },
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const MockComponent = ({ open = true, onClose = vi.fn(), userId = '123' }) => (
  <QueryClientProvider client={queryClient}>
    <I18nextProvider i18n={i18n}>
      <AddAddressModal open={open} onClose={onClose} userId={userId} />
    </I18nextProvider>
  </QueryClientProvider>
);

describe('AddAddressModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useCountryData as any).mockReturnValue({
      countryOptions: [
        { value: '1', label: 'Country 1' },
        { value: '2', label: 'Country 2' },
      ],
      cityOptions: vi.fn().mockReturnValue([
        { value: '101', label: 'City 1' },
        { value: '102', label: 'City 2' },
      ]),
    });

    vi.mocked(useDisclosure as any).mockReturnValue({
      isOpen: false,
      onOpen: vi.fn(),
      onClose: vi.fn(),
    });

    vi.mocked(useMutateAddAddress as any).mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue(undefined),
      isPending: false,
    });
  });

  it('renders modal title and form fields', () => {
    render(<MockComponent />);

    expect(screen.getByLabelText(/Location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Address Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Street Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Post Code/i)).toBeInTheDocument();
  });

  it('disables submit button when loading', () => {
    vi.mocked(useMutateAddAddress as any).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: true,
    });

    render(<MockComponent />);

    const button = screen.getByTestId('submit-button');
    expect(button).toBeDisabled();
  });
});
