/**
 * TanStack Table type extensions and filter types
 */

import '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';

// ============================================================================
// Filter Types
// ============================================================================

// Text operators
export type TextFilterOperator = 'contains' | 'equals' | 'startsWith' | 'endsWith';

// Select operators
export type SelectFilterOperator = 'is' | 'isNot' | 'isAnyOf';

// Date operators
export type DateFilterOperator = 'dateIs' | 'dateBefore' | 'dateAfter' | 'dateBetween';

// Number operators
export type NumberFilterOperator = 'numberEquals' | 'greaterThan' | 'lessThan';

// All filter operators
export type FilterOperator =
  | TextFilterOperator
  | SelectFilterOperator
  | DateFilterOperator
  | NumberFilterOperator;

// Filter column type
export type FilterColumnType = 'text' | 'select' | 'date' | 'number';

/**
 * Configuration for a filterable column
 */
export interface FilterConfig {
  /** Column ID (must match column accessorKey) */
  id: string;

  /** Display label for the column */
  label: string;

  /** Type of filter to use */
  type: FilterColumnType;

  /** Options for select-type filters */
  options?: Array<{
    value: string;
    label: string;
  }>;
}

/**
 * An active filter applied to the table
 */
export interface ActiveFilter {
  /** Column ID being filtered */
  columnId: string;

  /** Filter operator */
  operator: FilterOperator;

  /** Filter value:
   * - string for text/number/single select
   * - string[] for isAnyOf
   * - [string, string] for dateBetween
   */
  value: string | string[] | [string, string];
}

/**
 * Extended column definition with filter, search, and sticky support
 */
export type FilterableColumnDef<TData, TValue = unknown> = ColumnDef<TData, TValue> & {
  /**
   * Human-readable label for this column
   * Used in column visibility dropdown and other UI elements
   * If not provided, falls back to column.id
   */
  label?: string;

  /** Filter configuration for this column */
  filter?: {
    label: string;
    type: FilterColumnType;
    options?: Array<{
      value: string;
      label: string;
    }>;
  };

  /**
   * Make this column searchable via the search bar
   * When enabled, this column will be included in global search
   */
  searchable?: boolean;

  /**
   * Make this column sticky (fixed position during horizontal scroll)
   * - First column: sticky to the left
   * - Last column: sticky to the right
   */
  sticky?: boolean;
};
