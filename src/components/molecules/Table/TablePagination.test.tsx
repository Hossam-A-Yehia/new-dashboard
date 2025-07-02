import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import TablePagination from './TablePagination';

vi.mock('lucide-react', () => ({
  ChevronLeft: ({ className }: { className: string }) => <svg data-testid="chevron-left" className={className} />,
  ChevronRight: ({ className }: { className: string }) => <svg data-testid="chevron-right" className={className} />,
  ChevronsLeft: ({ className }: { className: string }) => <svg data-testid="chevrons-left" className={className} />,
  ChevronsRight: ({ className }: { className: string }) => <svg data-testid="chevrons-right" className={className} />,
}));

describe('TablePagination', () => {
  const mockSetPageIndex = vi.fn();
  const defaultProps: any = {
    pageIndex: 0,
    totalPages: 10,
    setPageIndex: mockSetPageIndex,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render when totalPages is 1 or less', () => {
    const { container } = render(<TablePagination {...defaultProps} totalPages={1} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders pagination controls and page info', () => {
    render(<TablePagination {...defaultProps} />);

    expect(screen.getByText('Page 1 of 10')).toBeInTheDocument();
    expect(screen.getByTestId('chevrons-left')).toBeInTheDocument();
    expect(screen.getByTestId('chevron-left')).toBeInTheDocument();
    expect(screen.getByTestId('chevron-right')).toBeInTheDocument();
    expect(screen.getByTestId('chevrons-right')).toBeInTheDocument();
  });

  it('disables first and previous buttons on first page', () => {
    render(<TablePagination {...defaultProps} pageIndex={0} />);

    const firstButton = screen.getByTestId('chevrons-left').closest('button');
    const prevButton = screen.getByTestId('chevron-left').closest('button');

    expect(firstButton).toBeDisabled();
    expect(prevButton).toBeDisabled();
    expect(firstButton).toHaveClass('text-gray-300', 'cursor-not-allowed');
    expect(prevButton).toHaveClass('text-gray-300', 'cursor-not-allowed');
  });

  it('disables next and last buttons on last page', () => {
    render(<TablePagination {...defaultProps} pageIndex={9} totalPages={10} />);

    const nextButton = screen.getByTestId('chevron-right').closest('button');
    const lastButton = screen.getByTestId('chevrons-right').closest('button');

    expect(nextButton).toBeDisabled();
    expect(lastButton).toBeDisabled();
    expect(nextButton).toHaveClass('text-gray-300', 'cursor-not-allowed');
    expect(lastButton).toHaveClass('text-gray-300', 'cursor-not-allowed');
  });

  it('calls setPageIndex with correct values when clicking navigation buttons', () => {
    render(<TablePagination {...defaultProps} pageIndex={5} />);

    fireEvent.click(screen.getByTestId('chevrons-left').closest('button')!);
    expect(mockSetPageIndex).toHaveBeenCalledWith(0);

    fireEvent.click(screen.getByTestId('chevron-left').closest('button')!);
    expect(mockSetPageIndex).toHaveBeenCalledWith(4);

    fireEvent.click(screen.getByTestId('chevron-right').closest('button')!);
    expect(mockSetPageIndex).toHaveBeenCalledWith(6);

    fireEvent.click(screen.getByTestId('chevrons-right').closest('button')!);
    expect(mockSetPageIndex).toHaveBeenCalledWith(9);
  });

  it('displays correct page numbers when total pages <= 5', () => {
    render(<TablePagination {...defaultProps} totalPages={5} />);

    const pageButtons = screen.getAllByRole('button', { name: /[1-5]/ });
    expect(pageButtons).toHaveLength(5);
    expect(pageButtons[0]).toHaveTextContent('1');
    expect(pageButtons[4]).toHaveTextContent('5');
  });

  it('shows ellipsis between non-consecutive page numbers', () => {
    render(<TablePagination {...defaultProps} pageIndex={5} totalPages={10} />);

    const ellipsis = screen.getAllByText('...');
    expect(ellipsis).toHaveLength(2); 
  });

  it('applies active styles to current page button', () => {
    render(<TablePagination {...defaultProps} pageIndex={2} totalPages={5} />);

    const activeButton = screen.getByRole('button', { name: '3' });
    expect(activeButton).toHaveClass('bg-blue-50', 'border-blue-500', 'text-blue-600');
  });

});