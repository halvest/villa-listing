// src/components/Pagination.tsx
import React from 'react';
import { usePagination, DOTS } from '../hooks/usePagination';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface PaginationProps {
  onPageChange: (page: number) => void;
  totalCount: number;
  siblingCount?: number;
  currentPage: number;
  pageSize: number;
  disabled?: boolean;
}

const Pagination: React.FC<PaginationProps> = (props) => {
  const { onPageChange, totalCount, siblingCount = 1, currentPage, pageSize, disabled } = props;

  const paginationRange = usePagination({ currentPage, totalCount, siblingCount, pageSize });

  if (currentPage === 0 || (paginationRange && paginationRange.length < 2)) {
    return null;
  }

  const onNext = () => onPageChange(currentPage + 1);
  const onPrevious = () => onPageChange(currentPage - 1);

  let lastPage = paginationRange ? paginationRange[paginationRange.length - 1] : 0;
  
  return (
    <div className="flex justify-center items-center mt-12">
      <nav aria-label="Page navigation">
        <ul className="inline-flex items-center -space-x-px">
          <li>
            <button
              onClick={onPrevious}
              disabled={currentPage === 1 || disabled}
              className="flex items-center justify-center h-10 px-4 leading-tight text-slate-500 bg-white border border-slate-300 rounded-l-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={16} />
            </button>
          </li>
          {paginationRange?.map((pageNumber, index) => {
            if (pageNumber === DOTS) {
              return <li key={index} className="px-4 h-10 flex items-center leading-tight text-slate-500 bg-white border border-slate-300">...</li>;
            }
            return (
              <li key={index}>
                <button
                  onClick={() => onPageChange(Number(pageNumber))}
                  disabled={disabled}
                  className={`flex items-center justify-center h-10 px-4 leading-tight border border-slate-300 transition-colors ${
                    currentPage === pageNumber
                      ? 'z-10 text-white bg-sky-500 border-sky-500'
                      : 'text-slate-500 bg-white hover:bg-slate-100'
                  }`}
                >
                  {pageNumber}
                </button>
              </li>
            );
          })}
          <li>
            <button
              onClick={onNext}
              disabled={currentPage === lastPage || disabled}
              className="flex items-center justify-center h-10 px-4 leading-tight text-slate-500 bg-white border border-slate-300 rounded-r-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowRight size={16} />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
