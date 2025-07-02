import { PaginationProps } from "@/types/Molecules";
import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  lastPage,
  onPageChange,
}) => {
  const getPages = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(lastPage, currentPage + 2);

    if (endPage - startPage < 4) {
      if (currentPage < 3) {
        endPage = Math.min(lastPage, startPage + 4);
      } else {
        startPage = Math.max(1, endPage - 4);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };
  return (
    <div
      className="flex justify-center mt-10 ml-[20px] ltr:md:ml-[300px] rtl:md:mr-[300px]"
      data-testid="pagination"
    >
      <button
        aria-label="Previous"
        className=" flex items-center justify-center rtl:rotate-180 mx-2 bg-white rounded-full size-[40px] hover:bg-main hover:text-white duration-300 disabled:opacity-50"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <FaArrowLeft />
      </button>
      {getPages().map((page) => (
        <button
          key={page}
          className={`mx-1 rounded-full size-[40px] duration-300  ${
            page === currentPage
              ? "bg-orange-500 text-white"
              : " hover:bg-main hover:opacity-70"
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <button
        aria-label="Next"
        className=" flex items-center justify-center rtl:rotate-180 mx-2 bg-white rounded-full size-[40px] hover:bg-main hover:text-white duration-300 disabled:opacity-50"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === lastPage}
      >
        <FaArrowRight />
      </button>
    </div>
  );
};

export default Pagination;
