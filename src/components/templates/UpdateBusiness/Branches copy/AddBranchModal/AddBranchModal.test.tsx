import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AddBranchModal from './AddBranchModal';
import {  useMutateAddBranch } from '@/hooks/useBranches';
import { useDisclosure } from '@/hooks/useDisclosure';
import { useCountryData } from '@/hooks/useCountryData';

i18n.use(initReactI18next).init({
  lng: 'en',
  resources: {
    en: {
      translation: {
        'Add Branch': 'Add Branch',
        'business_profile_form.basic_form.location': 'Location',
        'add_branch.country': 'Country',
        'add_branch.city': 'City',
        'add_branch.branch_name': 'Branch Name',
        'add_branch.post_code': 'Post Code',
        'add_branch.phone ': 'Phone',
        'add_branch.email': 'Email',
        'add_branch.country_placeholder': 'Select a country',
        'add_branch.city_placeholder': 'Select a city',
        'add_branch.branch_name_placeholder': 'Enter branch name',
        'add_branch.post_code_placeholder': 'Enter post code',
        'add_branch.phone_placeholder': 'Enter phone',
        'add_branch.email_placeholder': 'Enter email',
        'Cancel': 'Cancel',
        'Save': 'Save',
        'Branch Added Successfully!': 'Branch Added Successfully!',
        'The email or phone has already been taken.': 'The email or phone has already been taken.',
        'business_profile_form.basic_form.business_location': 'Business Location',
        'business_profile_form.shared.save': 'Save',
      },
    },
  },
});

vi.mock('@/hooks/useCountryData', () => ({
  useCountryData: vi.fn(),
}));
vi.mock('@/hooks/useBranches', () => ({
  useMutateAddBranch: vi.fn(),
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
      <AddBranchModal open={open} onClose={onClose} userId={userId} />
    </I18nextProvider>
  </QueryClientProvider>
);

describe('AddBranchModal', () => {
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

    vi.mocked(useMutateAddBranch as any).mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue(undefined),
      isPending: false,
    });
  });


  it('renders the modal with title and form fields', () => {
    render(<MockComponent />);

    expect(screen.getByText('Add Branch')).toBeInTheDocument();
    expect(screen.getByText('Branch Name')).toBeInTheDocument();
    expect(screen.getByText('Post Code')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });


  it('disables Save button when mutation is pending', () => {
    vi.mocked(useMutateAddBranch as any).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: true,
    });

    render(<MockComponent />);

    const saveButton = screen.getByText('Save');
    expect(saveButton).toBeDisabled();
  });

  it('closes the modal when Cancel is clicked', () => {
    const onClose = vi.fn();
    render(<MockComponent onClose={onClose} />);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(onClose).toHaveBeenCalled();
  });

});