/**
 * useTableFilters Hook
 *
 * Custom hook for managing table filters with URL synchronization
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import type { Row } from '@tanstack/react-table';
import type { FilterConfig, ActiveFilter } from '@/types/table';
import {
  applyTextFilter,
  applySelectFilter,
  applyDateFilter,
  applyNumberFilter,
  serializeFiltersToURL,
  deserializeFiltersFromURL,
} from '@/utils/table-filters';

interface UseTableFiltersOptions {
  /** Configuration for filterable columns */
  filterConfigs: FilterConfig[];

  /** Initial filters (optional) */
  initialFilters?: ActiveFilter[];

  /** Whether to sync filters with URL parameters */
  syncWithURL?: boolean;
}

interface UseTableFiltersReturn {
  /** Currently active filters */
  activeFilters: ActiveFilter[];

  /** Add a new filter */
  addFilter: (filter: ActiveFilter) => void;

  /** Remove a filter by index */
  removeFilter: (index: number) => void;

  /** Update a filter by index */
  updateFilter: (index: number, filter: ActiveFilter) => void;

  /** Clear all filters */
  clearAllFilters: () => void;

  /** Filter function for TanStack Table */
  tableFilterFn: (row: Row<any>) => boolean;
}

export function useTableFilters({
  filterConfigs,
  initialFilters = [],
  syncWithURL = true,
}: UseTableFiltersOptions): UseTableFiltersReturn {
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>(() => {
    // Initialize from URL if sync is enabled
    if (syncWithURL && typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const urlFilters = deserializeFiltersFromURL(searchParams);
      return urlFilters.length > 0 ? urlFilters : initialFilters;
    }
    return initialFilters;
  });

  // Sync filters to URL when they change
  useEffect(() => {
    if (!syncWithURL || typeof window === 'undefined') return;

    const currentParams = new URLSearchParams(window.location.search);
    const filterParams = serializeFiltersToURL(activeFilters);
    const newParams = new URLSearchParams(currentParams);

    // Remove all existing filter params
    Array.from(newParams.keys()).forEach((key) => {
      if (key.startsWith('f') && key.match(/^f\d+_(col|op|val)$/)) {
        newParams.delete(key);
      }
    });

    // Add new filter params
    if (filterParams) {
      const filterSearchParams = new URLSearchParams(filterParams);
      filterSearchParams.forEach((value, key) => {
        newParams.set(key, value);
      });
    }

    // Update URL without page reload
    const newUrl = `${window.location.pathname}${newParams.toString() ? '?' + newParams.toString() : ''}`;
    window.history.replaceState({}, '', newUrl);
  }, [activeFilters, syncWithURL]);

  // Add a new filter
  const addFilter = useCallback((filter: ActiveFilter) => {
    setActiveFilters((prev) => [...prev, filter]);
  }, []);

  // Remove a filter by index
  const removeFilter = useCallback((index: number) => {
    setActiveFilters((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Update a filter by index
  const updateFilter = useCallback((index: number, filter: ActiveFilter) => {
    setActiveFilters((prev) => prev.map((f, i) => (i === index ? filter : f)));
  }, []);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setActiveFilters([]);
  }, []);

  // Generate filter function for TanStack Table
  const tableFilterFn = useMemo(() => {
    return (row: Row<any>) => {
      // If no filters, show all rows
      if (activeFilters.length === 0) return true;

      // Row must pass ALL filters (AND logic)
      return activeFilters.every((filter) => {
        const { columnId, operator, value } = filter;

        // Find the filter config for this column
        const config = filterConfigs.find((c) => c.id === columnId);
        if (!config) return true; // Skip invalid filters

        // Get the cell value
        const cellValue = row.getValue(columnId);

        // Apply the appropriate filter function based on type
        switch (config.type) {
          case 'text':
            return applyTextFilter(cellValue, value as string, operator as any);
          case 'select':
            return applySelectFilter(cellValue, value, operator as any);
          case 'date':
            return applyDateFilter(cellValue, value as any, operator as any);
          case 'number':
            return applyNumberFilter(cellValue, value as string, operator as any);
          default:
            return true;
        }
      });
    };
  }, [activeFilters, filterConfigs]);

  return {
    activeFilters,
    addFilter,
    removeFilter,
    updateFilter,
    clearAllFilters,
    tableFilterFn,
  };
}
