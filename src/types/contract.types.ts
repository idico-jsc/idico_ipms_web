/**
 * Contract Type Definitions
 *
 * Types for contract management features
 */

export interface Contract {
  id: string;
  contract_code: string;
  customer_name: string;
  rental_duration: string;
  status: ContractStatus;
  pdf_file: string; // URL to PDF file
  created: string; // ISO date string
  modified: string; // ISO date string
}

export type ContractStatus = 'active' | 'expired' | 'pending' | 'terminated';

export interface ContractFormData {
  contract_code: string;
  customer_name: string;
  rental_duration: string;
  status: ContractStatus;
  pdf_file: string;
}
