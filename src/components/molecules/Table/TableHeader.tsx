import { ChevronDown, ChevronUp } from 'lucide-react';
import { Column, SortConfig } from './types';

interface TableHeaderProps<T> {
  columns: Column<T>[];
  sortConfig: SortConfig | null;
  onSort: (key: string) => void;
}

function TableHeader<T>({ columns, sortConfig, onSort }: TableHeaderProps<T>) {
  return (
    <thead className="bg-main text-white">
      <tr>
        {columns.map((column, index) => {
          const isSorted = sortConfig?.key === column.accessor;
          const isAscending = isSorted && sortConfig.direction === 'asc';
          const isDescending = isSorted && sortConfig.direction === 'desc';
          
          return (
            <th 
              key={index} 
              className={`
                px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium text-white tracking-wider whitespace-nowrap
                ${column.sortable ? 'cursor-pointer select-none' : ''}
                ${column.className || ''}
              `}
              onClick={() => column.sortable && onSort(column.accessor as string)}
            >
              <div className="flex items-center space-x-1">
                <span className="truncate">{column.header}</span>
                {column.sortable && (
                  <span className="inline-flex flex-col flex-shrink-0">
                    <ChevronUp 
                      className={`h-2.5 w-2.5 sm:h-3 sm:w-3 -mb-1 transition-colors ${isAscending ? 'text-blue-600' : 'text-white'}`} 
                    />
                    <ChevronDown 
                      className={`h-2.5 w-2.5 sm:h-3 sm:w-3 transition-colors ${isDescending ? 'text-blue-600' : 'text-white'}`} 
                    />
                  </span>
                )}
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
}

export default TableHeader;