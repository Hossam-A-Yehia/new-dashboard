import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import LogoUpload from './LogoUpload';
import * as useFileUploaderModule from '@/hooks/useFileUploader';

vi.mock('@/hooks/useFileUploader', () => ({
  useFileUploader: vi.fn(),
}));

vi.mock('react-icons/md', () => ({
  MdOutlineModeEdit: () => <span>EditIcon</span>,
}));

describe('LogoUpload', () => {
  const setFieldValue = vi.fn();
  const defaultProps = {
    setFieldValue,
    name: 'logo',
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
    render(<LogoUpload {...defaultProps} />);
    const logoContainer = screen.getByTestId('logo');
    expect(logoContainer).toBeInTheDocument();
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', '/default-logo.png');
  });

  it('displays defaultImage when provided', () => {
    render(<LogoUpload {...defaultProps} defaultImage="/custom-logo.png" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', '/custom-logo.png');
  });

  it('displays file preview when fileList has a file', () => {
    (useFileUploaderModule.useFileUploader as any).mockReturnValue({
      ...mockUseFileUploader,
      fileList: [{ preview: '/preview-image.png' }],
    });
    render(<LogoUpload {...defaultProps} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', '/preview-image.png');
  });

  it('renders file input and edit button', () => {
    render(<LogoUpload {...defaultProps} />);
    const input = screen.getByTestId('input-for-logo');
    expect(input).toHaveAttribute('type', 'file');
    expect(input).toHaveAttribute('accept', 'image/jpeg,image/png');
    const editButton = screen.getByRole('button');
    expect(editButton).toBeInTheDocument();
    expect(screen.getByText('EditIcon')).toBeInTheDocument();
  });
});