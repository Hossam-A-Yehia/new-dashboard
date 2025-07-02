import { Column } from './types';

interface TableBodyProps<T> {
  columns: Column<T>[];
  data: T[];
  loading: boolean;
  emptyMessage: string;
  pageSize: number;
}

function TableBody<T>({ columns, data, loading, emptyMessage, pageSize }: TableBodyProps<T>) {
  if (loading) {
    return (
      <tbody>
        {Array.from({ length: pageSize }).map((_, rowIndex) => (
          <tr key={`skeleton-${rowIndex}`} className="border-b border-gray-100">
            {columns.map((_, colIndex) => (
              <td key={`skeleton-${rowIndex}-${colIndex}`} className="px-3 py-2 sm:px-4 sm:py-3">
                <div className="animate-pulse">
                  <div className="h-3 sm:h-4 bg-gray-200 rounded-md w-3/4"></div>
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }

  if (data.length === 0) {
    return (
      <tbody>
        <tr>
          <td 
            colSpan={columns.length} 
            className="px-3 py-8 sm:px-6 sm:py-16 text-center"
          >
            <div className="flex flex-col items-center justify-center text-gray-400">
              <div className="text-2xl sm:text-4xl mb-2 sm:mb-4">📭</div>
              <div className="text-gray-500 font-medium text-sm sm:text-base">{emptyMessage}</div>
              <div className="text-gray-400 text-xs sm:text-sm mt-1">Try adjusting your search or filter criteria</div>
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className="divide-y divide-gray-100">
      {data.map((row, rowIndex) => (
        <tr 
          key={rowIndex} 
          className="hover:bg-gray-50/80 transition-colors duration-200 group"
        >
          {columns.map((column, colIndex) => {
            const value = typeof column.accessor === 'string' 
              ? column.accessor.split('.').reduce((obj, key) => obj?.[key], row as any) 
              : row[column.accessor];
              
            return (
              <td 
                key={`${rowIndex}-${colIndex}`} 
                className={`px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-gray-900 whitespace-nowrap ${column.className || ''}`}
              >
                {column.cell ? column.cell(value, row) : (
                  <span className="block truncate max-w-[150px] sm:max-w-[200px]">{value}</span>
                )}
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  );
}

export default TableBody;