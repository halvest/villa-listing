// src/components/Pagination.tsx
import React from 'react';
import { usePagination, DOTS } from '../hooks/usePagination';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

  // Jangan render komponen jika hanya ada satu halaman atau kurang
  if (currentPage === 0 || (paginationRange && paginationRange.length < 2)) {
    return null;
  }

  const onNext = () => {
    if (disabled) return;
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    if (disabled) return;
    onPageChange(currentPage - 1);
  };

  const lastPage = paginationRange ? paginationRange[paginationRange.length - 1] : 0;
  
  // Base styling untuk tombol
  const baseButtonClass = "flex items-center justify-center h-10 px-4 leading-tight border border-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white";
  const activePageClass = "z-10 text-white bg-sky-600 border-sky-600 hover:bg-sky-700";
  const inactivePageClass = "text-slate-500 bg-white hover:bg-slate-100";

  return (
    <div className="flex justify-center items-center py-12">
      <nav aria-label="Navigasi Halaman">
        <ul className="inline-flex items-center -space-x-px text-sm">
          <li>
            <button
              onClick={onPrevious}
              disabled={currentPage === 1 || disabled}
              className={`${baseButtonClass} rounded-l-lg`}
              aria-label="Halaman Sebelumnya"
            >
              <ChevronLeft size={16} />
            </button>
          </li>
          {paginationRange?.map((pageNumber, index) => {
            if (pageNumber === DOTS) {
              return <li key={`dots-${index}`} className={`${baseButtonClass} px-4 text-slate-500`}>&#8230;</li>;
            }
            
            const isCurrent = currentPage === pageNumber;

            return (
              <li key={pageNumber}>
                <button
                  onClick={() => onPageChange(Number(pageNumber))}
                  disabled={disabled}
                  className={`${baseButtonClass} ${isCurrent ? activePageClass : inactivePageClass}`}
                  // Atribut ARIA untuk aksesibilitas
                  aria-current={isCurrent ? 'page' : undefined}
                  aria-label={isCurrent ? `Halaman ${pageNumber}, Halaman saat ini` : `Ke Halaman ${pageNumber}`}
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
              className={`${baseButtonClass} rounded-r-lg`}
              aria-label="Halaman Selanjutnya"
            >
              <ChevronRight size={16} />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;