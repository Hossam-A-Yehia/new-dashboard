import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FileUploadSection from './FileUploadSection';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
  I18nextProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('FileUploadSection', () => {
  const mockHandleFileChange = vi.fn();
  const mockRemoveFile = vi.fn();
  const mockUploadedFiles = [
    {
      file: new File(['test content'], 'test.pdf', { type: 'application/pdf' }),
    },
    {
      file: new File(['test content'], 'test.jpg', { type: 'image/jpeg' }),
      error: 'File too large',
    },
  ];

  const renderComponent = () => {
    return render(
      <FileUploadSection
        uploadedFiles={mockUploadedFiles}
        handleFileChange={mockHandleFileChange}
        removeFile={mockRemoveFile}
      />
    );
  };

  it('renders file upload section with upload button', () => {
    renderComponent();
    expect(screen.getByTestId('file-input')).toBeInTheDocument();
    expect(screen.getByText('rfq.upload_file.upload_file')).toBeInTheDocument();
    expect(screen.getByText('rfq.upload_file.allowed_files')).toBeInTheDocument();
  });

  it('displays uploaded files correctly', () => {
    renderComponent();
    expect(screen.getByText('test.pdf')).toBeInTheDocument();
    expect(screen.getByText('test.jpg')).toBeInTheDocument();
    expect(screen.getByText('File too large')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('calls handleFileChange when file is selected', () => {
    renderComponent();
    const fileInput = screen.getByTestId('file-input');
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(mockHandleFileChange).toHaveBeenCalled();
  });

  it('calls removeFile when remove button is clicked', () => {
    renderComponent();
    const removeButtons = screen.getAllByRole('button');
    fireEvent.click(removeButtons[0]);
    expect(mockRemoveFile).toHaveBeenCalledWith(0);
  });
}); 