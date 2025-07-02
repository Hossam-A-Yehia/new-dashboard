import { ReactNode } from 'react';

export interface Column<T> {
  header: string;
  accessor: keyof T | string;
  cell?: (value: any, row: T) => ReactNode;
  sortable?: boolean;
  className?: string;
  responsive?: {
    hideBelow?: 'sm' | 'md' | 'lg';
  };
}

export interface TableContainerProps<T> {
  columns: Column<T>[];
  data: T[];
  customPageSize?: number;
  pageIndex?: number;
  setPageIndex?: (index: number) => void;
  totalPages: number;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  usePagination?: boolean;
  totalItems?: number;
}

export type SortDirection = 'asc' | 'desc' | null;

export interface SortConfig {
  key: string;
  direction: SortDirection;
}