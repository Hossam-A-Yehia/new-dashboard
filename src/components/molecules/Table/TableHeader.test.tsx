import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import TableHeader from './TableHeader';
import { Column, SortConfig } from './types';

vi.mock('lucide-react', () => ({
  ChevronUp: ({ className }: { className: string }) => <svg data-testid="chevron-up" className={className} />,
  ChevronDown: ({ className }: { className: string }) => <svg data-testid="chevron-down" className={className} />,
}));

describe('TableHeader', () => {
  const mockColumns: Column<any>[] = [
    { header: 'Name', accessor: 'name', sortable: true },
    { header: 'Age', accessor: 'age', sortable: true },
    { header: 'Status', accessor: 'status', sortable: false, className: 'text-center' },
  ];

  const mockOnSort = vi.fn();

  const defaultProps = {
    columns: mockColumns,
    sortConfig: null,
    onSort: mockOnSort,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all column headers correctly', () => {
    render(<TableHeader {...defaultProps} />);

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('applies correct classes to table header cells', () => {
    render(<TableHeader {...defaultProps} />);

    const nameHeader = screen.getByText('Name').closest('th');
    const statusHeader = screen.getByText('Status').closest('th');

    expect(nameHeader).toHaveClass('cursor-pointer', 'select-none');
    expect(statusHeader).toHaveClass('text-center');
    expect(statusHeader).not.toHaveClass('cursor-pointer');
  });


  it('calls onSort when clicking sortable column', () => {
    render(<TableHeader {...defaultProps} />);

    const nameHeader = screen.getByText('Name').closest('th')!;
    fireEvent.click(nameHeader);

    expect(mockOnSort).toHaveBeenCalledWith('name');
    expect(mockOnSort).toHaveBeenCalledTimes(1);
  });

  it('does not call onSort when clicking non-sortable column', () => {
    render(<TableHeader {...defaultProps} />);

    const statusHeader = screen.getByText('Status').closest('th')!;
    fireEvent.click(statusHeader);

    expect(mockOnSort).not.toHaveBeenCalled();
  });

  it('applies correct styles when column is sorted ascending', () => {
    const sortConfig: SortConfig = { key: 'name', direction: 'asc' };
    render(<TableHeader {...defaultProps} sortConfig={sortConfig} />);

    const chevronUp = screen.getAllByTestId('chevron-up')[0];
    const chevronDown = screen.getAllByTestId('chevron-down')[0];

    expect(chevronUp).toHaveClass('text-blue-600');
    expect(chevronDown).toHaveClass('text-white');
  });

  it('applies correct styles when column is sorted descending', () => {
    const sortConfig: SortConfig = { key: 'name', direction: 'desc' };
    render(<TableHeader {...defaultProps} sortConfig={sortConfig} />);

    const chevronUp = screen.getAllByTestId('chevron-up')[0];
    const chevronDown = screen.getAllByTestId('chevron-down')[0];

    expect(chevronUp).toHaveClass('text-white');
    expect(chevronDown).toHaveClass('text-blue-600');
  });

  it('applies correct styles when no sorting is applied', () => {
    render(<TableHeader {...defaultProps} />);

    const chevronUp = screen.getAllByTestId('chevron-up')[0];
    const chevronDown = screen.getAllByTestId('chevron-down')[0];

    expect(chevronUp).toHaveClass('text-white');
    expect(chevronDown).toHaveClass('text-white');
  });
});