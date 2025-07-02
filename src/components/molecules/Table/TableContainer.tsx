import { useState, useEffect, useMemo } from 'react';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import TablePagination from './TablePagination';
import { TableContainerProps, SortConfig } from './types';

function TableContainer<T extends Record<string, any>>({
  columns,
  data,
  customPageSize = 10,
  pageIndex = 0,
  setPageIndex = () => {},
  totalPages,
  totalItems,
  loading = false,
  emptyMessage = 'No data available',
  className = '',
  usePagination = true,
}: TableContainerProps<T>) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  useEffect(() => {
    if (usePagination && totalPages && pageIndex >= totalPages && totalPages > 0) {
      setPageIndex(totalPages - 1);
    }
  }, [pageIndex, totalPages, setPageIndex, usePagination]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' | null = 'asc';

    if (sortConfig?.key === key) {
      direction =
        sortConfig.direction === 'asc' ? 'desc' : sortConfig.direction === 'desc' ? null : 'asc';
    }

    setSortConfig(direction ? { key, direction } : null);
  };

  const displayData = useMemo(() => {
    const sortedData = [...data];

    if (sortConfig?.direction) {
      sortedData.sort((a, b) => {
        const aValue = sortConfig.key.split('.').reduce((obj, key) => obj?.[key], a);
        const bValue = sortConfig.key.split('.').reduce((obj, key) => obj?.[key], b);

        const modifier = sortConfig.direction === 'asc' ? 1 : -1;
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return String(aValue).localeCompare(String(bValue)) * modifier;
        }

        return (aValue < bValue ? -1 : 1) * modifier;
      });
    }

    return sortedData;
  }, [data, sortConfig]);

  return (
    <div className="w-full">
      <div
        className={`w-full max-w-[1060px] overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg ${className}`}
      >
        {/* Horizontal scroll container for responsive design */}
        <div className="overflow-x-auto max-h-[400px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-300 ">
              <TableHeader columns={columns} sortConfig={sortConfig} onSort={handleSort} />
              <TableBody
                columns={columns}
                data={displayData}
                loading={loading}
                emptyMessage={emptyMessage}
                pageSize={customPageSize}
              />
            </table>
          </div>
        </div>
        {usePagination && (totalPages ?? 0) > 1 && (
          <div className="w-full border-t border-gray-200">
            <TablePagination
              pageIndex={pageIndex}
              totalPages={totalPages}
              setPageIndex={setPageIndex}
              totalItems={totalItems}
              customPageSize={customPageSize}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default TableContainer;