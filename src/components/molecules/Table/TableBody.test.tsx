import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import TableBody from './TableBody';
import { Column } from './types';

interface TestData {
  id: number;
  name: string;
  details: { age: number };
}

describe('TableBody', () => {
  const mockColumns: Column<TestData>[] = [
    { header: 'ID', accessor: 'id' },
    { header: 'Name', accessor: 'name', className: 'text-left' },
    { header: 'Age', accessor: 'details.age' },
    {
      header: 'Custom',
      accessor: 'name',
      cell: (value: string) => `Custom: ${value}`,
    },
  ];

  const mockData: TestData[] = [
    { id: 1, name: 'John', details: { age: 30 } },
    { id: 2, name: 'Jane', details: { age: 25 } },
  ];

  const defaultProps: any = {
    columns: mockColumns,
    data: mockData,
    loading: false,
    emptyMessage: 'No data available',
    pageSize: 5,
  };

  it('renders empty state when data is empty', () => {
    render(<TableBody {...defaultProps} data={[]} />);

    const emptyCell = screen.getByText('No data available');
    expect(emptyCell).toBeInTheDocument();
    expect(emptyCell).toHaveClass('text-center', 'text-gray-500');
    
    const row = screen.getByRole('row');
    expect(row.querySelector('td')).toHaveAttribute('colSpan', mockColumns.length.toString());
  });

  it('renders data rows correctly', () => {
    render(<TableBody {...defaultProps} />);

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(mockData.length);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('Custom: John')).toBeInTheDocument();
  });

  it('applies column className to cells', () => {
    render(<TableBody {...defaultProps} />);

    const nameCell = screen.getByText('John').closest('td');
    expect(nameCell).toHaveClass('text-left');
  });

  it('handles nested accessor correctly', () => {
    render(<TableBody {...defaultProps} />);

    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
  });

  it('renders custom cell content', () => {
    render(<TableBody {...defaultProps} />);

    expect(screen.getByText('Custom: John')).toBeInTheDocument();
    expect(screen.getByText('Custom: Jane')).toBeInTheDocument();
  });

  it('applies hover effect class to rows', () => {
    render(<TableBody {...defaultProps} />);

    const row = screen.getAllByRole('row')[0];
    expect(row).toHaveClass('hover:bg-gray-50', 'transition-colors', 'duration-150');
  });

  it('renders correct number of columns for each row', () => {
    render(<TableBody {...defaultProps} />);

    const rows = screen.getAllByRole('row');
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      expect(cells).toHaveLength(mockColumns.length);
    });
  });
});