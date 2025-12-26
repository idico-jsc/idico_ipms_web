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
import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTableFilters } from '@/hooks/use-table-filters';
import { extractFilterConfigsFromColumns } from '@/utils/table-filters';
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
  filterConfig?: FilterConfig[];
  onFiltersChange?: (filters: ActiveFilter[]) => void;
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
  filterConfig,
  onFiltersChange,
}: DataTableProps<TData, TValue>) {
  const { t } = useTranslation('common');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});

  // Extract filter configs from columns if not provided
  const finalFilterConfig = useMemo(() => {
    if (filterConfig && filterConfig.length > 0) {
      return filterConfig;
    }
    // Auto-extract from columns
    return extractFilterConfigsFromColumns(columns);
  }, [filterConfig, columns]);

  // Filter system integration
  const {
    activeFilters,
    addFilter,
    removeFilter,
    clearAllFilters,
    tableFilterFn,
  } = useTableFilters({
    filterConfigs: finalFilterConfig,
    syncWithURL: true,
  });

  // Notify parent of filter changes
  useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange(activeFilters);
    }
  }, [activeFilters, onFiltersChange]);

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
    globalFilterFn: tableFilterFn,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      columnSizing,
      globalFilter: activeFilters,
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

  // Calculate column widths
  const headerGroup = table.getHeaderGroups()[0];

  // Find the index of the resizing column
  const resizingColumnIndex = resizingColumn && headerGroup
    ? headerGroup.headers.findIndex(h => h.column.id === resizingColumn)
    : -1;

  // Calculate the left position of the resize line (in pixels)
  let resizingColumnOffset = 0;
  if (resizingColumn && headerGroup) {
    for (const header of headerGroup.headers) {
      if (header.column.id === resizingColumn) {
        resizingColumnOffset += header.getSize();
        break;
      }
      resizingColumnOffset += header.getSize();
    }
  }

  // Helper function to get column width
  const getColumnWidth = (size: number, columnIndex: number) => {
    // If not currently resizing, use pixel width
    if (resizingColumnIndex < 0) {
      return `${size}px`;
    }

    // Columns to the left of resizing column: keep pixel width (fixed)
    if (columnIndex < resizingColumnIndex) {
      return `${size}px`;
    }

    // Resizing column and columns to the right: use pixel width
    return `${size}px`;
  };

  return (
    <div className="space-y-4">
      {/* Filter Toolbar */}
      {finalFilterConfig.length > 0 && (
        <DataTableFilterToolbar
          filterConfigs={finalFilterConfig}
          activeFilters={activeFilters}
          onAddFilter={addFilter}
          onRemoveFilter={removeFilter}
          onClearAll={clearAllFilters}
        />
      )}

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
            className="table-fixed w-full"
          >
            <TableHeader className="overflow-hidden">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header, index) => {
                    const isSticky = (header.column.columnDef as any).sticky;
                    const isFirstColumn = index === 0;
                    const isLastColumn = index === headerGroup.headers.length - 1;
                    const nextColumn = headerGroup.headers[index + 1];
                    const isNextColumnSticky = (nextColumn?.column.columnDef as any)?.sticky;
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
                          width: getColumnWidth(header.getSize(), index),
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
                      const isSticky = (cell.column.columnDef as any).sticky;
                      const isFirstColumn = index === 0;
                      const isLastColumn = index === row.getVisibleCells().length - 1;

                      return (
                        <TableCell
                          key={cell.id}
                          className={cn("bg-card overflow-hidden",{
                            'sticky left-0 z-10 bg-card': isSticky && isFirstColumn,
                            'sticky right-0 z-10 bg-card': isSticky && isLastColumn
                          })}
                          style={{
                            width: getColumnWidth(cell.column.getSize(), index),
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

// ============================================================================
// Filter Components
// ============================================================================

import type { FilterConfig, ActiveFilter, FilterOperator } from '@/types/table';
import { X, Plus } from 'lucide-react';
import { Badge } from '@/components/atoms/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/atoms/dropdown-menu';
import { Input } from '@/components/atoms/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/select';
import { DateInput } from '@/components/organisms/date-input';
import { getOperatorsForType, getOperatorLabelKey } from '@/utils/table-filters';
import { format } from 'date-fns';

// ============================================================================
// DataTableFilterBadge
// ============================================================================

interface DataTableFilterBadgeProps {
  filter: ActiveFilter;
  filterConfig: FilterConfig;
  onRemove: () => void;
}

export function DataTableFilterBadge({
  filter,
  filterConfig,
  onRemove,
}: DataTableFilterBadgeProps) {
  const { t } = useTranslation('common');

  // Format the value for display
  const displayValue = Array.isArray(filter.value)
    ? filter.value.join(', ')
    : filter.value;

  // Get operator label (bypass strict typing for dynamic keys)
  const operatorLabel = t(getOperatorLabelKey(filter.operator) as never);

  // For text filters, don't show operator since it's always 'contains'
  const showOperator = filterConfig.type !== 'text';

  return (
    <Badge variant="secondary" className="gap-1 pr-1">
      <span className="text-xs">
        <span className="font-medium">{filterConfig.label}:</span>{' '}
        {showOperator && (
          <>
            <span className="text-muted-foreground">
              {operatorLabel}
            </span>{' '}
          </>
        )}
        <span className="font-medium">{displayValue}</span>
      </span>
      <Button
        variant="ghost"
        size="sm"
        className="h-4 w-4 p-0 hover:bg-transparent"
        onClick={onRemove}
      >
        <X className="h-3 w-3" />
      </Button>
    </Badge>
  );
}

// ============================================================================
// DataTableFilterValueInput
// ============================================================================

interface DataTableFilterValueInputProps {
  type: FilterConfig['type'];
  operator: FilterOperator;
  value: string | string[];
  options?: FilterConfig['options'];
  onChange: (value: string | string[]) => void;
}

export function DataTableFilterValueInput({
  type,
  operator,
  value,
  options,
  onChange,
}: DataTableFilterValueInputProps) {
  const { t } = useTranslation('common');

  // Text and number inputs
  if (type === 'text' || type === 'number') {
    return (
      <Input
        type={type === 'number' ? 'number' : 'text'}
        placeholder={t('table.filters.enterValue')}
        value={value as string}
        onChange={(e) => onChange(e.target.value)}
        className="h-8"
      />
    );
  }

  // Date inputs
  if (type === 'date') {
    if (operator === 'dateBetween') {
      const [start, end] = Array.isArray(value) ? value : ['', ''];

      return (
        <div className="flex gap-2">
          <DateInput
            value={start ? new Date(start) : undefined}
            onChange={(date) => {
              if (date) {
                onChange([format(date, 'yyyy-MM-dd'), end]);
              }
            }}
            placeholder={t('table.filters.enterValue')}
            className="flex-1"
          />

          <DateInput
            value={end ? new Date(end) : undefined}
            onChange={(date) => {
              if (date) {
                onChange([start, format(date, 'yyyy-MM-dd')]);
              }
            }}
            placeholder={t('table.filters.enterValue')}
            className="flex-1"
          />
        </div>
      );
    }

    return (
      <DateInput
        value={value ? new Date(value as string) : undefined}
        onChange={(date) => {
          if (date) {
            onChange(format(date, 'yyyy-MM-dd'));
          }
        }}
        placeholder={t('table.filters.enterValue')}
      />
    );
  }

  // Select inputs
  if (type === 'select' && options) {
    if (operator === 'isAnyOf') {
      // Multi-select - for now, use a simple comma-separated input
      // In a real app, you might want a proper multi-select component
      return (
        <Input
          type="text"
          placeholder={t('table.filters.enterValue')}
          value={Array.isArray(value) ? value.join(', ') : value}
          onChange={(e) => onChange(e.target.value.split(',').map((v) => v.trim()))}
          className="h-8"
        />
      );
    }

    return (
      <Select value={value as string} onValueChange={onChange}>
        <SelectTrigger className="h-8">
          <SelectValue placeholder={t('table.filters.enterValue')} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return null;
}

// ============================================================================
// DataTableFilterDropdown
// ============================================================================

interface DataTableFilterDropdownProps {
  filterConfigs: FilterConfig[];
  onAddFilter: (filter: ActiveFilter) => void;
  onClearAll: () => void;
  hasActiveFilters: boolean;
}

export function DataTableFilterDropdown({
  filterConfigs,
  onAddFilter,
  onClearAll,
  hasActiveFilters,
}: DataTableFilterDropdownProps) {
  const { t } = useTranslation('common');
  const [open, setOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<FilterConfig | null>(null);
  const [selectedOperator, setSelectedOperator] = useState<FilterOperator | null>(null);
  const [filterValue, setFilterValue] = useState<string | string[]>('');

  const operators = selectedColumn
    ? getOperatorsForType(selectedColumn.type)
    : [];

  const handleReset = () => {
    setSelectedColumn(null);
    setSelectedOperator(null);
    setFilterValue('');
  };

  const handleApply = () => {
    if (selectedColumn && filterValue) {
      // For text type, always use 'contains' operator
      const operator = selectedColumn.type === 'text' ? 'contains' : selectedOperator;

      if (operator) {
        onAddFilter({
          columnId: selectedColumn.id,
          operator: operator,
          value: filterValue,
        });
        handleReset();
        setOpen(false);
      }
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <Plus className="mr-2 h-4 w-4" />
          {t('table.filters.addFilter')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-80">
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel className="p-0">{t('table.filters.addFilter')}</DropdownMenuLabel>
          {hasActiveFilters && (
            <button
              onClick={() => {
                onClearAll();
                setOpen(false);
              }}
              className="text-xs text-destructive hover:text-destructive/80 transition-colors"
            >
              {t('table.filters.clearAll')}
            </button>
          )}
        </div>
        <DropdownMenuSeparator />

        {/* Step 1: Select Column */}
        <div className="p-2">
          <label className="text-xs text-muted-foreground mb-1 block">
            {t('table.filters.selectColumn')}
          </label>
          <Select
            value={selectedColumn?.id || ''}
            onValueChange={(value) => {
              const config = filterConfigs.find((c) => c.id === value);
              setSelectedColumn(config || null);
              setSelectedOperator(null);
              setFilterValue('');
            }}
          >
            <SelectTrigger className="h-8">
              <SelectValue placeholder={t('table.filters.selectColumn')} />
            </SelectTrigger>
            <SelectContent>
              {filterConfigs.map((config) => (
                <SelectItem key={config.id} value={config.id}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Step 2: Select Operator (skip for text type) */}
        {selectedColumn && selectedColumn.type !== 'text' && (
          <div className="p-2">
            <label className="text-xs text-muted-foreground mb-1 block">
              {t('table.filters.selectOperator')}
            </label>
            <Select
              value={selectedOperator || ''}
              onValueChange={(value) => {
                setSelectedOperator(value as FilterOperator);
                setFilterValue('');
              }}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder={t('table.filters.selectOperator')} />
              </SelectTrigger>
              <SelectContent>
                {operators.map((op) => (
                  <SelectItem key={op} value={op}>
                    {t(getOperatorLabelKey(op) as never)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Step 3: Enter Value (for text: after column, for others: after operator) */}
        {selectedColumn && (selectedColumn.type === 'text' || selectedOperator) && (
          <div className="p-2">
            <label className="text-xs text-muted-foreground mb-1 block">
              {t('table.filters.enterValue')}
            </label>
            <DataTableFilterValueInput
              type={selectedColumn.type}
              operator={selectedColumn.type === 'text' ? 'contains' : selectedOperator!}
              value={filterValue}
              options={selectedColumn.options}
              onChange={setFilterValue}
            />
          </div>
        )}

        <DropdownMenuSeparator />

        {/* Actions */}
        <div className="flex gap-2 p-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-8"
            onClick={() => {
              handleReset();
              setOpen(false);
            }}
          >
            {t('cancel')}
          </Button>
          <Button
            size="sm"
            className="flex-1 h-8"
            onClick={handleApply}
            disabled={
              !selectedColumn ||
              !filterValue ||
              (selectedColumn.type !== 'text' && !selectedOperator)
            }
          >
            {t('apply')}
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ============================================================================
// DataTableFilterToolbar
// ============================================================================

interface DataTableFilterToolbarProps {
  filterConfigs: FilterConfig[];
  activeFilters: ActiveFilter[];
  onAddFilter: (filter: ActiveFilter) => void;
  onRemoveFilter: (index: number) => void;
  onClearAll: () => void;
}

export function DataTableFilterToolbar({
  filterConfigs,
  activeFilters,
  onAddFilter,
  onRemoveFilter,
  onClearAll,
}: DataTableFilterToolbarProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {activeFilters.map((filter, index) => {
        const config = filterConfigs.find((c) => c.id === filter.columnId);
        if (!config) return null;

        return (
          <DataTableFilterBadge
            key={index}
            filter={filter}
            filterConfig={config}
            onRemove={() => onRemoveFilter(index)}
          />
        );
      })}

      <DataTableFilterDropdown
        filterConfigs={filterConfigs}
        onAddFilter={onAddFilter}
        onClearAll={onClearAll}
        hasActiveFilters={activeFilters.length > 0}
      />
    </div>
  );
}