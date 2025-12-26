/**
 * DataTable Component
 *
 * Reusable table component using TanStack Table
 * Supports sorting, filtering, pagination, and column visibility
 */

import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  type ColumnSizingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/atoms/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/atoms/table';
import { type Column } from '@tanstack/react-table';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/utils';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSize?: number;
  searchColumn?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  emptyMessage?: string;
  showPagination?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageSize = 10,
  searchColumn,
  searchValue,
  onSearchChange,
  emptyMessage = 'No results.',
  showPagination = true,
}: DataTableProps<TData, TValue>) {
  const { t } = useTranslation('common');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onColumnSizingChange: setColumnSizing,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      columnSizing,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  // Sync external search with internal column filter
  if (searchColumn && searchValue !== undefined && onSearchChange) {
    const currentFilter = table.getColumn(searchColumn)?.getFilterValue() as string;
    if (currentFilter !== searchValue) {
      table.getColumn(searchColumn)?.setFilterValue(searchValue);
    }
  }

  const totalRows = table.getFilteredRowModel().rows.length;
  const currentPage = table.getState().pagination.pageIndex;
  const currentPageSize = table.getState().pagination.pageSize;
  const from = totalRows === 0 ? 0 : currentPage * currentPageSize + 1;
  const to = Math.min((currentPage + 1) * currentPageSize, totalRows);

  // Get resizing column info
  const resizingColumn = table.getState().columnSizingInfo.isResizingColumn;

  // Calculate the left position of the resize line
  let resizingColumnOffset = 0;
  if (resizingColumn) {
    const headerGroup = table.getHeaderGroups()[0];
    if (headerGroup) {
      for (const header of headerGroup.headers) {
        if (header.column.id === resizingColumn) {
          resizingColumnOffset += header.getSize();
          break;
        }
        resizingColumnOffset += header.getSize();
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card">
        <div className="overflow-x-auto relative">
          {/* Resize indicator line - shows during column resizing */}
          {resizingColumn && (
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-brand-primary pointer-events-none"
              style={{
                left: `${resizingColumnOffset}px`,
                zIndex: 100,
              }}
            />
          )}
          <Table
            className="table-fixed"
            style={{
              width: table.getCenterTotalSize(),
            }}
          >
            <TableHeader className="overflow-hidden">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header, index) => {
                    const isSticky = header.column.columnDef.meta?.sticky;
                    const isFirstColumn = index === 0;
                    const isLastColumn = index === headerGroup.headers.length - 1;
                    const nextColumn = headerGroup.headers[index + 1];
                    const isNextColumnSticky = nextColumn?.column.columnDef.meta?.sticky;
                    const enableResizing = header.column.columnDef.enableResizing !== false;
                    const canShowResizeHandle = enableResizing && !isSticky && !isNextColumnSticky;

                    return (
                      <TableHead
                        key={header.id}
                        className={cn("text-brand-primary dark:text-foreground bg-gray-50 dark:bg-accent py-4 relative group/header overflow-hidden",{
                          'sticky left-0 z-10': isSticky && isFirstColumn,
                          'sticky right-0 z-10 ': isSticky && isLastColumn
                        })}
                        style={{
                          width: header.getSize(),
                          maxWidth: header.getSize(),
                          minWidth: header.getSize(),
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanResize() && canShowResizeHandle && (
                          <div
                            onMouseDown={header.getResizeHandler()}
                            onTouchStart={header.getResizeHandler()}
                            className={cn(
                              'absolute right-0 top-0 bottom-0 m-auto h-[50%] w-px cursor-col-resize select-none touch-none transition-all z-20',
                              'before:absolute before:inset-y-0 before:-left-2 before:-right-2 before:w-5',
                              'opacity-0 group-hover/header:opacity-100 bg-black/5 dark:bg-gray-500 hover:bg-black/20'
                            )}
                            style={{
                              userSelect: 'none',
                            }}
                          />
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'} className="group/row">
                    {row.getVisibleCells().map((cell, index) => {
                      const isSticky = cell.column.columnDef.meta?.sticky;
                      const isFirstColumn = index === 0;
                      const isLastColumn = index === row.getVisibleCells().length - 1;

                      return (
                        <TableCell
                          key={cell.id}
                          className={cn("bg-card overflow-hidden",{
                            'sticky left-0 z-10 backdrop-blur-xs bg-white/1 dark:bg-black/1': isSticky && isFirstColumn,
                            'sticky right-0 z-10 backdrop-blur-xs bg-white/1 dark:bg-black/1': isSticky && isLastColumn
                          })}
                          style={{
                            width: cell.column.getSize(),
                            maxWidth: cell.column.getSize(),
                            minWidth: cell.column.getSize(),
                          }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {showPagination && totalRows > 0 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-4">
            <div className="text-sm text-muted-foreground">
              {t('pagination.showing', { from, to, total: totalRows })}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="h-4 w-4" />
                {t('pagination.previous')}
              </Button>
              <div className="flex items-center gap-1">
                <span className="text-sm">
                  Page {currentPage + 1} of {table.getPageCount()}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                {t('pagination.next')}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 data-[state=open]:bg-accent"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        <span>{title}</span>
        {column.getIsSorted() === 'desc' ? (
          <ArrowDown className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === 'asc' ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4" />
        )}
      </Button>
    </div>
  );
}