import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  lng: 'en',
  resources: {
    en: {
      translation: {
        'Confirm Deletion': 'Confirm Deletion',
        'Are you sure you want to delete this item? This action cannot be undone.':
          'Are you sure you want to delete this item? This action cannot be undone.',
        Cancel: 'Cancel',
        Delete: 'Delete',
      },
    },
  },
});

vi.mock('lucide-react', () => ({
  AlertTriangle: ({ size }: { size: number }) => <svg data-testid="alert-triangle" width={size} height={size} />,
}));

vi.mock('@/components/atoms/Button/Button', () => ({
  default: ({ children, onClick, variant, disabled }: any) => (
    <button data-testid={`button-${variant}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

describe('DeleteConfirmationModal', () => {
  const defaultProps: any = {
    open: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    title: 'Confirm Deletion',
    message: 'Are you sure you want to delete this item? This action cannot be undone.',
    loading: false,
  };

  const renderWithI18n = (props: any) =>
    render(
      <I18nextProvider i18n={i18n}>
        <DeleteConfirmationModal {...props} />
      </I18nextProvider>
    );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal when open is true', () => {
    renderWithI18n(defaultProps);

    expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();
    expect(
      screen.getByText('Are you sure you want to delete this item? This action cannot be undone.')
    ).toBeInTheDocument();
    expect(screen.getByTestId('alert-triangle')).toBeInTheDocument();
    expect(screen.getByTestId('button-outlinePrimary')).toHaveTextContent('Cancel');
    expect(screen.getByTestId('button-delete')).toHaveTextContent('Delete');
  });

  it('does not render modal when open is false', () => {
    renderWithI18n({ ...defaultProps, open: false });

    expect(screen.queryByText('Confirm Deletion')).not.toBeInTheDocument();
    expect(screen.queryByTestId('alert-triangle')).not.toBeInTheDocument();
  });

  it('renders custom title and message when provided', () => {
    renderWithI18n({
      ...defaultProps,
      title: 'Custom Title',
      message: 'Custom message here.',
    });

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom message here.')).toBeInTheDocument();
  });

  it('calls onClose when Cancel button is clicked', () => {
    renderWithI18n(defaultProps);

    fireEvent.click(screen.getByTestId('button-outlinePrimary'));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when Delete button is clicked', () => {
    renderWithI18n(defaultProps);

    fireEvent.click(screen.getByTestId('button-delete'));
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('disables Delete button when loading is true', () => {
    renderWithI18n({ ...defaultProps, loading: true });

    const deleteButton = screen.getByTestId('button-delete');
    expect(deleteButton).toBeDisabled();
  });

  it('renders AlertTriangle with correct size', () => {
    renderWithI18n(defaultProps);

    const alertTriangle = screen.getByTestId('alert-triangle');
    expect(alertTriangle).toHaveAttribute('width', '32');
    expect(alertTriangle).toHaveAttribute('height', '32');
  });

  it('uses default translations when not overridden', () => {
    renderWithI18n({ ...defaultProps, title: undefined, message: undefined });

    expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();
    expect(
      screen.getByText('Are you sure you want to delete this item? This action cannot be undone.')
    ).toBeInTheDocument();
  });
});