import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AddServiceRequestModal from './AddSuugestServiceModal';
import {  useMutateServiceRequest } from '@/hooks/useSuggestServices';
import { useFetchUserCategories } from '@/hooks/useCategories';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('@/hooks/useSuggestServices', () => ({
  useEditUserServiceRequest: vi.fn(),
  useMutateServiceRequest: vi.fn(),
}));

vi.mock('@/hooks/useCategories', () => ({
  useFetchUserCategories: vi.fn(),
}));

vi.mock('react-toastify', () => ({
  toast: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

const queryClient = new QueryClient();

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const mockCategories = {
  data: {
    payload: [
      { category: { id: 1, name_en: 'Category 1', name_ar: 'فئة 1' } },
      { category: { id: 2, name_en: 'Category 2', name_ar: 'فئة 2' } },
    ],
  },
};

describe('AddServiceRequestModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useFetchUserCategories as any).mockReturnValue({
      data: mockCategories,
      isLoading: false,
    });
  });

  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    isEdit: false,
    userID: '123',
    selectedRow: undefined,
    selectedUser: {
      user: {
        user_type_value: 'SERVICE_PROVIDER',
      },
    },
  };

  it('disables submit button when form is submitting', () => {
    (useMutateServiceRequest as any).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: true,
    });

    render(<AddServiceRequestModal {...defaultProps} />, { wrapper });
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('closes modal when cancel button is clicked', () => {
    render(<AddServiceRequestModal {...defaultProps} />, { wrapper });

    fireEvent.click(screen.getByText('Cancel'));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});