/**
 * TanStack Table type extensions
 */

import '@tanstack/react-table';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    /**
     * Make this column sticky (fixed position during horizontal scroll)
     * - First column: sticky to the left
     * - Last column: sticky to the right
     */
    sticky?: boolean;
  }
}
