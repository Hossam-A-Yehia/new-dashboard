import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import CoverUpload from './CoverUpload';
import * as useFileUploaderModule from '@/hooks/useFileUploader';

vi.mock('@/hooks/useFileUploader', () => ({
  useFileUploader: vi.fn(),
}));

vi.mock('react-icons/md', () => ({
  MdOutlineModeEdit: () => <span>EditIcon</span>,
}));

describe('CoverUpload', () => {
  const setFieldValue = vi.fn();
  const defaultProps = {
    setFieldValue,
    name: 'cover',
    defaultValue: null,
    defaultImage: undefined,
  };

  const mockUseFileUploader = {
    getInputProps: vi.fn(() => ({ type: 'file', accept: 'image/jpeg,image/png' })),
    getRootProps: vi.fn(() => ({ className: 'mock-root-props' })),
    fileList: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useFileUploaderModule.useFileUploader as any).mockReturnValue(mockUseFileUploader);
  });

  it('renders the component with default props', () => {
    render(<CoverUpload {...defaultProps} />);
    const profileContainer = screen.getByTestId('profile');
    expect(profileContainer).toBeInTheDocument();
    const img = screen.getByRole('img', { name: 'Cover preview' });
    expect(img).toHaveAttribute('src', '/profile.png');
  });

  it('displays defaultImage when provided', () => {
    render(<CoverUpload {...defaultProps} defaultImage="/custom-cover.png" />);
    const img = screen.getByRole('img', { name: 'Cover preview' });
    expect(img).toHaveAttribute('src', '/custom-cover.png');
  });

  it('displays file preview when fileList has a file', () => {
    (useFileUploaderModule.useFileUploader as any).mockReturnValue({
      ...mockUseFileUploader,
      fileList: [{ preview: '/preview-image.png' }],
    });
    render(<CoverUpload {...defaultProps} />);
    const img = screen.getByRole('img', { name: 'Cover preview' });
    expect(img).toHaveAttribute('src', '/preview-image.png');
  });

  it('renders file input and edit button', () => {
    render(<CoverUpload {...defaultProps} />);
    const input = screen.getByTestId('input-for-cover');
    expect(input).toHaveAttribute('type', 'file');
    expect(input).toHaveAttribute('accept', 'image/jpeg,image/png');
    const editButton = screen.getByRole('button');
    expect(editButton).toBeInTheDocument();
    expect(screen.getByText('EditIcon')).toBeInTheDocument();
  });

});