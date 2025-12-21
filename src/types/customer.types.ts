/**
 * Customer Type Definitions
 *
 * Types for customer management features
 */

export interface Customer {
  id: string;
  name: string;
  company_name: string;
  tax_code: string;
  address: string;
  status: 'active' | 'inactive';
  tags: string[];
  created: string; // ISO date string
  modified: string; // ISO date string
}

export type CustomerStatus = 'active' | 'inactive';

export interface CustomerFormData {
  name: string;
  company_name: string;
  tax_code: string;
  address: string;
  status: CustomerStatus;
  tags: string;
}
