import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface TablePaginationProps {
  pageIndex: number;
  totalPages: number;
  totalItems?: number;
  setPageIndex: (index: number) => void;
  customPageSize: number;
}

function TablePagination({ pageIndex, totalPages, totalItems, setPageIndex, customPageSize }: TablePaginationProps) {
  const handleFirstPage = () => setPageIndex(0);
  const handlePreviousPage = () => setPageIndex(Math.max(0, pageIndex - 1));
  const handleNextPage = () => setPageIndex(Math.min(totalPages - 1, pageIndex + 1));
  const handleLastPage = () => setPageIndex(totalPages - 1);

  const getPageNumbers = () => {
    const maxPageButtons = 5;
    const pages: number[] = [];

    if (totalPages <= maxPageButtons) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(0, pageIndex - Math.floor(maxPageButtons / 2));
      let endPage = Math.min(totalPages - 1, startPage + maxPageButtons - 1);
      
      // Adjust if we're near the end
      if (endPage - startPage < maxPageButtons - 1) {
        startPage = Math.max(0, endPage - maxPageButtons + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  const startItem = pageIndex * customPageSize + 1;
  const endItem = Math.min((pageIndex + 1) * customPageSize, totalItems || 0);

  return (
    <div className="bg-white px-6 py-4 border-t border-gray-100" data-testid="table-pagination">
      {/* Desktop Layout */}
      <div className="hidden sm:flex sm:items-center sm:justify-between">
        {/* Results info */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {totalItems ? (
              <>
                Showing <span className="font-semibold text-gray-900">{startItem}</span> to
                <span className="font-semibold text-gray-900">{endItem}</span> of
                <span className="font-semibold text-gray-900">{totalItems}</span> results
              </>
            ) : (
              <>
                Page <span className="font-semibold text-gray-900">{pageIndex + 1}</span> of
                <span className="font-semibold text-gray-900">{totalPages}</span>
              </>
            )}
          </span>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-1">
          {/* First & Previous */}
          <button
            onClick={handleFirstPage}
            disabled={pageIndex === 0}
            className={`
              inline-flex items-center justify-center w-9 h-9 rounded-lg border text-sm font-medium transition-all duration-200
              ${pageIndex === 0 
                ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50' 
                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm'
              }
            `}
            title="First page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
          
          <button
            onClick={handlePreviousPage}
            disabled={pageIndex === 0}
            className={`
              inline-flex items-center justify-center w-9 h-9 rounded-lg border text-sm font-medium transition-all duration-200
              ${pageIndex === 0 
                ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50' 
                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm'
              }
            `}
            title="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1 mx-2">
            {getPageNumbers().map((page, index, array) => (
              <React.Fragment key={page}>
                {index > 0 && array[index - 1] !== page - 1 && (
                  <span className="inline-flex items-center justify-center w-9 h-9 text-sm text-gray-500">
                    …
                  </span>
                )}
                <button
                  onClick={() => setPageIndex(page)}
                  className={`
                    inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200
                    ${page === pageIndex
                      ? 'bg-main text-white shadow-md border border-main hover:bg-main-hover'
                      : 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm'
                    }
                  `}
                >
                  {page + 1}
                </button>
              </React.Fragment>
            ))}
          </div>

          {/* Next & Last */}
          <button
            onClick={handleNextPage}
            disabled={pageIndex === totalPages - 1}
            className={`
              inline-flex items-center justify-center w-9 h-9 rounded-lg border text-sm font-medium transition-all duration-200
              ${pageIndex === totalPages - 1
                ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm'
              }
            `}
            title="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          
          <button
            onClick={handleLastPage}
            disabled={pageIndex === totalPages - 1}
            className={`
              inline-flex items-center justify-center w-9 h-9 rounded-lg border text-sm font-medium transition-all duration-200
              ${pageIndex === totalPages - 1
                ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm'
              }
            `}
            title="Last page"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="flex items-center justify-between sm:hidden">
        <button
          onClick={handlePreviousPage}
          disabled={pageIndex === 0}
          className={`
            inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200
            ${pageIndex === 0 
              ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50' 
              : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm'
            }
          `}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            Page <span className="font-semibold text-gray-900">{pageIndex + 1}</span> of
            <span className="font-semibold text-gray-900">{totalPages}</span>
          </span>
        </div>
        
        <button
          onClick={handleNextPage}
          disabled={pageIndex === totalPages - 1}
          className={`
            inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200
            ${pageIndex === totalPages - 1
              ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
              : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm'
            }
          `}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default TablePagination;