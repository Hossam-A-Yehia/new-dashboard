import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Formik, Form } from 'formik';
import FileUploaderField from './FileUploaderField';
import { useFileUploader } from '@/hooks/useFileUploader';

vi.mock('@/hooks/useFileUploader');
vi.mock('@/components/molecules/SelectInput/SelectInput', () => ({
  default: ({ name, options, id, placeholder, additionalClasses }: any) => (
    <select data-testid={id} name={name} className={additionalClasses}>
      <option value="">{placeholder}</option>
      {options.map((option: any) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
}));

vi.mock('@/constants/Constants', () => ({
  file_types: [
    { value: 'doc', label: 'Document' },
    { value: 'pdf', label: 'PDF' },
  ],
}));

const renderWithFormik = (ui: any, initialValues = {}) =>
  render(
    <Formik initialValues={initialValues} onSubmit={vi.fn()}>
      <Form>{ui}</Form>
    </Formik>,
  );

describe('FileUploaderField', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useFileUploader).mockReturnValue({
      getInputProps: () => ({ type: 'file', multiple: true, 'data-testid': 'file-input' } as any),
      getRootProps: () => ({ refKey: 'ref', role: 'presentation' } as any),
      fileList: [],
    });
  });

  it('renders correctly with label and subtitle', () => {
    renderWithFormik(
      <FileUploaderField name="files" label="Upload Files" subtitle="Supported formats: PDF, DOC" />,
      { files: [] },
    );

    expect(screen.getByText('Upload Files')).toBeInTheDocument();
    expect(screen.getByText('Supported formats: PDF, DOC')).toBeInTheDocument();
    expect(screen.getByText('Drag and drop files or')).toBeInTheDocument();
    expect(screen.getByText('Browse')).toBeInTheDocument();
    expect(screen.getByText('Maximum 5 files, up to 2MB per file')).toBeInTheDocument();
  });

  it('displays file upload area when file count is below maxFiles', () => {
    renderWithFormik(<FileUploaderField name="files" label="Upload Files" maxFiles={5} />, {
      files: [{ file: new File([''], 'test.pdf'), type: null }],
    });

    expect(screen.getByText('1 out of 5 files uploaded')).toBeInTheDocument();
    expect(screen.getByTestId('files.0.type')).toBeInTheDocument(); 
  });

  it('hides file upload area and shows limit message when maxFiles is reached', () => {
    const files = Array(5).fill({ file: new File([''], 'test.pdf'), type: null });
    renderWithFormik(<FileUploaderField name="files" label="Upload Files" maxFiles={5} />, {
      files,
    });

    expect(screen.queryByText('Drag and drop files or')).not.toBeInTheDocument();
    expect(screen.getByText('Maximum file limit reached (5)')).toBeInTheDocument();
  });

  it('displays error message when file size exceeds 2MB', async () => {
    const largeFile = new File([''], 'large.pdf', { type: 'application/pdf' });
    Object.defineProperty(largeFile, 'size', { value: 3 * 1024 * 1024 }); // 3MB
    vi.mocked(useFileUploader).mockReturnValue({
      getInputProps: () => ({ type: 'file', multiple: true, 'data-testid': 'file-input' } as any),
      getRootProps: () =>
        ({
          onDrop: () => {
            const mockedUploader = vi.mocked(useFileUploader).mock.calls[0]?.[0];
            if (mockedUploader?.onChange) {
              mockedUploader.onChange([largeFile]);
            }
          },
        } as any),
      fileList: [],
    });

    renderWithFormik(<FileUploaderField name="files" label="Upload Files" maxFiles={5} />, {
      files: [],
    });

    const fileInput = screen.getByTestId('file-input');
    fireEvent.drop(fileInput, { dataTransfer: { files: [largeFile] } });

    await waitFor(() => {
      expect(
        screen.getByText(
          'The following files are too large: large.pdf. The maximum size is 2MB per file.',
        ),
      ).toBeInTheDocument();
    });
  });


  it('adds files to Formik state on valid upload', async () => {
    const newFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    Object.defineProperty(newFile, 'size', { value: 1 * 1024 * 1024 }); // 1MB
    let formikValues: any = { files: [] };

    vi.mocked(useFileUploader).mockReturnValue({
      getInputProps: () => ({ type: 'file', multiple: true, 'data-testid': 'file-input' } as any),
      getRootProps: () =>
        ({
          onDrop: () => {
            const mockedUploader = vi.mocked(useFileUploader).mock.calls[0]?.[0];
            if (mockedUploader?.onChange) {
              mockedUploader.onChange([newFile]);
            }
          },
        } as any),
      fileList: [],
    });

    renderWithFormik(
      <Formik
        initialValues={{ files: [] }}
        onSubmit={(values) => {
          formikValues = values;
        }}
      >
        {() => (
          <Form>
            <FileUploaderField name="files" label="Upload Files" maxFiles={5} />
            <button type="submit" data-testid="submit">
              Submit
            </button>
          </Form>
        )}
      </Formik>,
    );

    const fileInput = screen.getByTestId('file-input');
    fireEvent.drop(fileInput, { dataTransfer: { files: [newFile] } });

    fireEvent.click(screen.getByTestId('submit'));

    await waitFor(() => {
      expect(formikValues.files).toEqual([{ file: newFile, type: null }]);
    });
  });

  it('removes a file from the list', async () => {
    const initialFiles = [
      { file: new File([''], 'test1.pdf'), type: null },
      { file: new File([''], 'test2.pdf'), type: null },
    ];
    let formikValues: any = { files: initialFiles };

    renderWithFormik(
      <Formik
        initialValues={{ files: initialFiles }}
        onSubmit={(values) => {
          formikValues = values;
        }}
      >
        {() => (
          <Form>
            <FileUploaderField name="files" label="Upload Files" maxFiles={5} />
            <button type="submit" data-testid="submit">
              Submit
            </button>
          </Form>
        )}
      </Formik>,
    );

    const removeButtons = screen.getAllByTestId('Remove-file');
    fireEvent.click(removeButtons[0]); // Remove first file

    fireEvent.click(screen.getByTestId('submit'));

    await waitFor(() => {
      expect(formikValues.files).toHaveLength(1);
      expect(formikValues.files[0].file.name).toBe('test2.pdf');
    });
  });

  it('displays correct file icon and size for uploaded files', () => {
    const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', { value: 1.5 * 1024 * 1024 }); // 1.5MB
    renderWithFormik(<FileUploaderField name="files" label="Upload Files" maxFiles={5} />, {
      files: [{ file, type: null }],
    });

    expect(screen.getByText('document.pdf')).toBeInTheDocument();
    expect(screen.getByText('1.50 MB')).toBeInTheDocument();
    expect(screen.getByTestId('files.0.type')).toBeInTheDocument(); 
  });

  it('displays remote file correctly with view link', () => {
    renderWithFormik(<FileUploaderField name="files" label="Upload Files" maxFiles={5} />, {
      files: [{ file: 'https://example.com/file.pdf', type: null }],
    });

    expect(screen.getByText('file.pdf')).toBeInTheDocument();
    expect(screen.getByText('Remote file')).toBeInTheDocument();
    expect(screen.getByText('View')).toHaveAttribute('href', 'https://example.com/file.pdf');
  });

  it('truncates long file names', () => {
    const longFileName = 'a'.repeat(40) + '.pdf';
    const file = new File([''], longFileName, { type: 'application/pdf' });
    renderWithFormik(<FileUploaderField name="files" label="Upload Files" maxFiles={5} />, {
      files: [{ file, type: null }],
    });

    expect(screen.getByText(`${'a'.repeat(30)}...`)).toBeInTheDocument();
  });
});