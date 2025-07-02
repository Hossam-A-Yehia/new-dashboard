import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ImageIndex from './Images';
import { useQueryClient } from '@tanstack/react-query';
import { useMutateDeleteImage } from '@/hooks/image';
import { toast } from 'react-toastify';
import { t } from 'i18next';

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: vi.fn(),
}));
vi.mock('@/hooks/image', () => ({
  useMutateDeleteImage: vi.fn(),
}));
vi.mock('react-toastify', () => ({
  toast: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));
vi.mock('i18next', () => ({
  t: vi.fn((key) => key),
}));

Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});

describe('ImageIndex Component', () => {
  const mockQueryClient = {
    invalidateQueries: vi.fn(),
  };
  const mockMutateAsync = vi.fn();
  const mockUserImages = [
    { id: 1, url: 'http://example.com/image1.jpg' },
    { id: 2, url: 'http://example.com/image2.jpg' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useQueryClient as any).mockReturnValue(mockQueryClient);
    (useMutateDeleteImage as any).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    });
    (t as any).mockImplementation((key: string) => key);
  });

  it('renders loading state when isLoading is true', () => {
    render(<ImageIndex userImages={[]} isLoading={true} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays no data message when userImages is empty and not loading', () => {
    render(<ImageIndex userImages={[]} isLoading={false} />);
    expect(screen.getByText('No Data to Preview!')).toBeInTheDocument();
  });

  it('handles copy button click', async () => {
    render(<ImageIndex userImages={mockUserImages} isLoading={false} />);
    const copyButton = screen.getAllByText('Copy')[0];
    fireEvent.click(copyButton);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockUserImages[0].url);
    expect(toast.info).toHaveBeenCalledWith('Image link copied successfully');
  });

  it('opens delete confirmation modal on delete button click', () => {
    render(<ImageIndex userImages={mockUserImages} isLoading={false} />);
    const deleteButton = screen.getAllByText('Delete')[0];
    fireEvent.click(deleteButton);
    expect(screen.getByText('Are you sure you want to delete this image?')).toBeInTheDocument();
  });

  it('opens image in new tab on view button click', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    render(<ImageIndex userImages={mockUserImages} isLoading={false} />);
    const viewButton = screen.getAllByText('View')[0];
    fireEvent.click(viewButton);
    expect(openSpy).toHaveBeenCalledWith(mockUserImages[0].url, '_blank');
    openSpy.mockRestore();
  });

  it('sets document title correctly', () => {
    render(<ImageIndex userImages={mockUserImages} isLoading={false} />);
    expect(document.title).toBe('Images | CraftScene App');
  });
});
