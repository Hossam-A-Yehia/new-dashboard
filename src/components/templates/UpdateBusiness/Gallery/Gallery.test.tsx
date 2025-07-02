import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import UserGallery from './Gallery';
import { useDropzone } from 'react-dropzone';
import { useMutateAddMultiImages, useFetchImages } from '@/hooks/image';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';

vi.mock('react-dropzone', () => ({
  useDropzone: vi.fn(),
}));

vi.mock('@/hooks/image', () => ({
  useFetchImages: vi.fn(),
  useMutateAddMultiImages: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (str: string) => str }),
}));

const queryClient = new QueryClient();

function renderComponent() {
  return render(
    <QueryClientProvider client={queryClient}>
      <ToastContainer />
      <UserGallery userId={1} />
    </QueryClientProvider>
  );
}

describe('UserGallery', () => {
  beforeEach(() => {
    (useDropzone as any).mockReturnValue({
      getRootProps: () => ({}),
      getInputProps: () => ({}),
      isDragActive: false,
    });

    (useFetchImages as any).mockReturnValue({
      data: { data: { payload: { data: [] } } },
      isLoading: false,
    });

    (useMutateAddMultiImages as any).mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue({}),
      isPending: false,
    });
  });

  it('renders the gallery title', () => {
    renderComponent();
    expect(screen.getByText('Your Gallery')).toBeInTheDocument();
  });

  it('renders the upload instruction text', () => {
    renderComponent();
    expect(screen.getByText('Drag & drop images here')).toBeInTheDocument();
    expect(screen.getByText('or')).toBeInTheDocument();
    expect(screen.getByText('browse files')).toBeInTheDocument();
  });

});
