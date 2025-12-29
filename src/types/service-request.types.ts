/**
 * Service Request Type Definitions
 *
 * Types for customer service request management features
 */

export interface ServiceRequest {
  id: string;
  request_type: RequestType;
  priority: Priority;
  title: string; // Auto-generated from type + timestamp
  description: string;
  location: string;
  status: RequestStatus;
  images: string[]; // Base64 encoded images
  customer_id: string;
  customer_name: string;
  assigned_to?: string;
  resolution_notes?: string;
  created: string; // ISO date string
  modified: string; // ISO date string
  submitted_at: string;
  in_progress_at?: string;
  resolved_at?: string;
  closed_at?: string;
}

export type RequestType = 'infrastructure' | 'electricity_water' | 'security' | 'it_internet';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type RequestStatus = 'submitted' | 'in_progress' | 'resolved' | 'closed';

export interface ServiceRequestFormData {
  request_type: RequestType;
  priority: Priority;
  description: string;
  location: string;
  images: string[];
}
