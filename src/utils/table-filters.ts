/**
 * Table Filter Utilities
 *
 * Utility functions for filtering table data
 */

import type {
  FilterOperator,
  FilterColumnType,
  FilterConfig,
  ActiveFilter,
  TextFilterOperator,
  SelectFilterOperator,
  DateFilterOperator,
  NumberFilterOperator,
} from '@/types/table';

// ============================================================================
// Filter Functions
// ============================================================================

/**
 * Apply text filter to a value
 */
export function applyTextFilter(
  value: any,
  filterValue: string,
  operator: TextFilterOperator
): boolean {
  if (value == null) return false;

  const stringValue = String(value).toLowerCase();
  const filter = filterValue.toLowerCase();

  switch (operator) {
    case 'contains':
      return stringValue.includes(filter);
    case 'equals':
      return stringValue === filter;
    case 'startsWith':
      return stringValue.startsWith(filter);
    case 'endsWith':
      return stringValue.endsWith(filter);
    default:
      return false;
  }
}

/**
 * Apply select filter to a value
 */
export function applySelectFilter(
  value: any,
  filterValue: string | string[],
  operator: SelectFilterOperator
): boolean {
  if (value == null) return false;

  const stringValue = String(value);

  switch (operator) {
    case 'is':
      return stringValue === filterValue;
    case 'isNot':
      return stringValue !== filterValue;
    case 'isAnyOf':
      return Array.isArray(filterValue) && filterValue.includes(stringValue);
    default:
      return false;
  }
}

/**
 * Apply date filter to a value
 */
export function applyDateFilter(
  value: any,
  filterValue: string | [string, string],
  operator: DateFilterOperator
): boolean {
  if (value == null) return false;

  const dateValue = new Date(value);
  if (isNaN(dateValue.getTime())) return false;

  switch (operator) {
    case 'dateIs': {
      const filterDate = new Date(filterValue as string);
      return (
        dateValue.getFullYear() === filterDate.getFullYear() &&
        dateValue.getMonth() === filterDate.getMonth() &&
        dateValue.getDate() === filterDate.getDate()
      );
    }
    case 'dateBefore': {
      const filterDate = new Date(filterValue as string);
      return dateValue < filterDate;
    }
    case 'dateAfter': {
      const filterDate = new Date(filterValue as string);
      return dateValue > filterDate;
    }
    case 'dateBetween': {
      if (!Array.isArray(filterValue) || filterValue.length !== 2) return false;
      const [start, end] = filterValue;
      const startDate = new Date(start);
      const endDate = new Date(end);
      return dateValue >= startDate && dateValue <= endDate;
    }
    default:
      return false;
  }
}

/**
 * Apply number filter to a value
 */
export function applyNumberFilter(
  value: any,
  filterValue: string,
  operator: NumberFilterOperator
): boolean {
  if (value == null) return false;

  const numValue = Number(value);
  const filterNum = Number(filterValue);

  if (isNaN(numValue) || isNaN(filterNum)) return false;

  switch (operator) {
    case 'numberEquals':
      return numValue === filterNum;
    case 'greaterThan':
      return numValue > filterNum;
    case 'lessThan':
      return numValue < filterNum;
    default:
      return false;
  }
}

// ============================================================================
// URL Serialization
// ============================================================================

/**
 * Serialize active filters to URL search params
 */
export function serializeFiltersToURL(filters: ActiveFilter[]): string {
  if (filters.length === 0) return '';

  const params = new URLSearchParams();

  filters.forEach((filter, index) => {
    const prefix = `f${index}`;
    params.set(`${prefix}_col`, filter.columnId);
    params.set(`${prefix}_op`, filter.operator);

    if (Array.isArray(filter.value)) {
      params.set(`${prefix}_val`, filter.value.join(','));
    } else {
      params.set(`${prefix}_val`, filter.value);
    }
  });

  return params.toString();
}

/**
 * Deserialize filters from URL search params
 */
export function deserializeFiltersFromURL(urlParams: URLSearchParams): ActiveFilter[] {
  const filters: ActiveFilter[] = [];
  let index = 0;

  while (true) {
    const prefix = `f${index}`;
    const columnId = urlParams.get(`${prefix}_col`);
    const operator = urlParams.get(`${prefix}_op`) as FilterOperator;
    const valueStr = urlParams.get(`${prefix}_val`);

    if (!columnId || !operator || !valueStr) break;

    let value: string | string[] | [string, string];

    // Parse value based on operator
    if (operator === 'isAnyOf') {
      value = valueStr.split(',');
    } else if (operator === 'dateBetween') {
      const parts = valueStr.split(',');
      if (parts.length === 2) {
        value = [parts[0], parts[1]];
      } else {
        // Invalid dateBetween value, skip this filter
        index++;
        continue;
      }
    } else {
      value = valueStr;
    }

    filters.push({ columnId, operator, value });
    index++;
  }

  return filters;
}

// ============================================================================
// Operator Helpers
// ============================================================================

/**
 * Get available operators for a filter type
 */
export function getOperatorsForType(type: FilterColumnType): FilterOperator[] {
  switch (type) {
    case 'text':
      return ['contains', 'equals', 'startsWith', 'endsWith'];
    case 'select':
      return ['is', 'isNot', 'isAnyOf'];
    case 'date':
      return ['dateIs', 'dateBefore', 'dateAfter', 'dateBetween'];
    case 'number':
      return ['numberEquals', 'greaterThan', 'lessThan'];
    default:
      return [];
  }
}

/**
 * Get human-readable label for an operator (key for i18n)
 */
export function getOperatorLabelKey(operator: FilterOperator): string {
  return `table.filters.operators.${operator}`;
}

/**
 * Extract filter configurations from column definitions
 */
export function extractFilterConfigsFromColumns(columns: Array<any>): FilterConfig[] {
  const configs: FilterConfig[] = [];

  for (const column of columns) {
    // Skip columns without filter config
    if (!column.filter) continue;

    // Get column ID from accessorKey or id
    const columnId = column.accessorKey || column.id;
    if (!columnId) continue;

    // Get label from filter config or column header
    const label =
      column.filter.label ||
      (typeof column.header === 'string' ? column.header : columnId);

    configs.push({
      id: columnId,
      label,
      type: column.filter.type,
      options: column.filter.options,
    });
  }

  return configs;
}
