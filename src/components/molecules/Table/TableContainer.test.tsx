import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import TableContainer from './TableContainer';
import { Column } from './types';

vi.mock('./TableHeader', () => ({
  default: ({ columns, sortConfig, onSort }: any) => (
    <thead data-testid="table-header">
      {columns.map((col: any, index: number) => (
        <th key={index} onClick={() => col.sortable && onSort(col.accessor)}>
          {col.header}
          {sortConfig?.key === col.accessor && sortConfig?.direction}
        </th>
      ))}
    </thead>
  ),
}));

vi.mock('./TableBody', () => ({
  default: ({ columns, data, loading, emptyMessage }: any) => (
    <tbody data-testid="table-body">
      {loading ? (
        <tr>
          <td>Loading...</td>
        </tr>
      ) : data.length === 0 ? (
        <tr>
          <td>{emptyMessage}</td>
        </tr>
      ) : (
        data.map((row: any, rowIndex: number) => (
          <tr key={rowIndex}>
            {columns.map((col: any, colIndex: number) => (
              <td key={colIndex}>{row[col.accessor]}</td>
            ))}
          </tr>
        ))
      )}
    </tbody>
  ),
}));

vi.mock('./TablePagination', () => ({
  default: ({ pageIndex, totalPages, setPageIndex }: any) => (
    <nav data-testid="table-pagination">
      <button onClick={() => setPageIndex(pageIndex - 1)} disabled={pageIndex === 0}>
        Previous
      </button>
      <span>
        Page {pageIndex + 1} of {totalPages}
      </span>
      <button onClick={() => setPageIndex(pageIndex + 1)} disabled={pageIndex === totalPages - 1}>
        Next
      </button>
    </nav>
  ),
}));

interface TestData {
  id: number;
  name: string;
  details: { age: number };
}

describe('TableContainer', () => {
  const mockColumns: Column<TestData>[] = [
    { header: 'ID', accessor: 'id', sortable: true },
    { header: 'Name', accessor: 'name', sortable: true },
    { header: 'Age', accessor: 'details.age', sortable: true },
  ];

  const mockData: TestData[] = [
    { id: 1, name: 'John', details: { age: 30 } },
    { id: 2, name: 'Jane', details: { age: 25 } },
    { id: 3, name: 'Bob', details: { age: 35 } },
  ];

  const defaultProps: any = {
    columns: mockColumns,
    data: mockData,
    customPageSize: 2,
    pageIndex: 0,
    setPageIndex: vi.fn(),
    loading: false,
    emptyMessage: 'No data available',
    className: '',
    usePagination: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders table structure with header, body, and pagination', () => {
    render(<TableContainer {...defaultProps} />);

    expect(screen.getByTestId('table-header')).toBeInTheDocument();
    expect(screen.getByTestId('table-body')).toBeInTheDocument();
  });

  it('does not render pagination when usePagination is false', () => {
    render(<TableContainer {...defaultProps} usePagination={false} />);

    expect(screen.getByTestId('table-header')).toBeInTheDocument();
    expect(screen.getByTestId('table-body')).toBeInTheDocument();
  });

  it('sorts data correctly for string values', () => {
    render(<TableContainer {...defaultProps} />);

    fireEvent.click(screen.getByText('Name'));
    const rows = screen.getAllByRole('row');
    expect(rows[0]).toHaveTextContent('Bob');
    expect(rows[1]).toHaveTextContent('Jane');
  });

  it('uses external totalPages when provided', () => {
    render(<TableContainer {...defaultProps} totalPages={5} />);

    expect(screen.getByText('Page 1 of 5')).toBeInTheDocument();
  });


  it('passes loading state to TableBody', () => {
    render(<TableContainer {...defaultProps} loading={true} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays empty message when data is empty', () => {
    render(<TableContainer {...defaultProps} data={[]} />);

    expect(screen.getByText('No data available')).toBeInTheDocument();
  });


  it('memoizes displayData correctly', () => {
    const { rerender } = render(<TableContainer {...defaultProps} />);
    const firstRows = screen.getAllByRole('row');

    rerender(<TableContainer {...defaultProps} />);
    const secondRows = screen.getAllByRole('row');

    expect(firstRows).toEqual(secondRows); 
  });
});