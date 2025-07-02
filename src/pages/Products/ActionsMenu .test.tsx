import { render, screen, fireEvent } from '@testing-library/react';
import ActionsMenu from './ActionsMenu ';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// Mock useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('ActionsMenu', () => {
  const mockSetSelectedRow = vi.fn();
  const mockSetIsEdit = vi.fn();
  const mockSetModal = vi.fn();
  const mockSetDeleteModal = vi.fn();
  const mockOpenImage = vi.fn();

  const props = {
    row: { id: 123 },
    t: (key: string) => key,
    setSelectedRow: mockSetSelectedRow,
    setIsEdit: mockSetIsEdit,
    setModal: mockSetModal,
    setDeleteModal: mockSetDeleteModal,
    openImage: mockOpenImage,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all buttons with correct labels', () => {
    render(
      <BrowserRouter>
        <ActionsMenu VariantsCount={0} {...props} />
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: 'Variants' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Images' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('calls appropriate functions on button clicks', () => {
    render(
      <BrowserRouter>
        <ActionsMenu VariantsCount={0} {...props} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Images' }));
    expect(mockSetSelectedRow).toHaveBeenCalledWith({ id: 123 });
    expect(mockOpenImage).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    expect(mockSetSelectedRow).toHaveBeenCalledWith({ id: 123 });
    expect(mockSetIsEdit).toHaveBeenCalledWith(true);
    expect(mockSetModal).toHaveBeenCalledWith(true);

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(mockSetSelectedRow).toHaveBeenCalledWith({ id: 123 });
    expect(mockSetDeleteModal).toHaveBeenCalledWith(true);
  });
});
