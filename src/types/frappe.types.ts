/**
 * Frappe TypeScript Type Definitions
 *
 * Type definitions for Frappe API responses and data structures
 */

/**
 * Frappe User
 */
export interface FrappeUser {
  name: string;
  email: string;
  full_name?: string;
  user_image?: string;
  enabled: boolean;
  user_type?: "System User" | "Website User";
  roles?: string[];
  creation?: string;
  modified?: string;
  assigned_sis_roles?: string[];
}

/**
 * Frappe Authentication Response
 */
export interface FrappeAuthResponse {
  message: string;
  home_page?: string;
  full_name?: string;
  token?: string;
}

/**
 * Frappe Token Response
 */
export interface FrappeTokenResponse {
  token: string;
  expires_in?: number;
  token_type?: "Bearer";
}

/**
 * Frappe Document (Generic)
 */
export interface FrappeDoc<T = Record<string, any>> {
  name: string;
  owner: string;
  creation: string;
  modified: string;
  modified_by: string;
  docstatus: 0 | 1 | 2; // 0: Draft, 1: Submitted, 2: Cancelled
  idx: number;
  doctype: string;
  [key: string]: any;
  data?: T;
}

/**
 * Frappe List Response
 */
export interface FrappeListResponse<T = any> {
  data: T[];
  total?: number;
  page_length?: number;
  start?: number;
}

/**
 * Frappe Error Response
 */
export interface FrappeError {
  httpStatus: number;
  httpStatusText: string;
  message: string;
  exception: string;
  exc?: string;
  exc_type?: string;
  _server_messages?: string;
}

export interface FrappeServerMessage {
  message: string;
  title?: string;
  indicator?: string;
}

/**
 * Frappe API Call Options
 */
export interface FrappeCallOptions {
  method?: string;
  args?: Record<string, any>;
  type?: "GET" | "POST";
  headers?: Record<string, string>;
}

/**
 * Frappe File Upload Response
 */
export interface FrappeFileResponse {
  file_url: string;
  file_name: string;
  file_size?: number;
  is_private?: boolean;
}

/**
 * Frappe Document Filter
 */
export type FrappeFilter = [string, string, any] | [string, string, any, string];

/**
 * Frappe Get Doc Options
 */
export interface FrappeGetDocOptions {
  fields?: string[];
  filters?: Record<string, any>;
}

/**
 * Frappe Get Doc List Options
 */
export interface FrappeGetDocListOptions {
  fields?: string[];
  filters?: FrappeFilter[];
  orderBy?: {
    field: string;
    order?: "asc" | "desc";
  };
  limit?: number;
  start?: number;
  asDict?: boolean;
}

/**
 * Frappe Create Doc Options
 */
export interface FrappeCreateDocOptions<T = any> {
  doctype: string;
  data: Partial<T>;
}

/**
 * Frappe Update Doc Options
 */
export interface FrappeUpdateDocOptions<T = any> {
  doctype: string;
  name: string;
  data: Partial<T>;
}

/**
 * Frappe Delete Doc Options
 */
export interface FrappeDeleteDocOptions {
  doctype: string;
  name: string;
}

/**
 * Frappe Search Options
 */
export interface FrappeSearchOptions {
  doctype: string;
  txt: string;
  filters?: Record<string, any>;
  fields?: string[];
  limit?: number;
}

/**
 * Frappe Token Parameters
 */
export interface FrappeTokenParams {
  useToken: boolean;
  token: () => string | null;
  type: "Bearer" | "token";
}

/**
 * Frappe Provider Config
 */
export interface FrappeConfig {
  url: string;
  tokenParams?: FrappeTokenParams;
  enableSocket?: boolean;
  socketPort?: string;
}

/**
 * Auth Hook Return Type
 */
export interface UseFrappeAuthReturn {
  currentUser: FrappeUser | null;
  isLoading: boolean;
  isValidating: boolean;
  error: FrappeError | null;
  login: (username: string, password: string) => Promise<FrappeAuthResponse>;
  logout: () => Promise<void>;
  updateCurrentUser: () => Promise<void>;
  setToken: (token: string, expiresIn?: number) => void;
  clearToken: () => void;
  hasToken: boolean;
}

/**
 * API Hook Return Type
 */
export interface UseFrappeAPIReturn {
  getDoc: <T = any>(
    doctype: string,
    name: string,
    options?: FrappeGetDocOptions,
  ) => Promise<FrappeDoc<T>>;
  getDocList: <T = any>(doctype: string, options?: FrappeGetDocListOptions) => Promise<T[]>;
  createDoc: <T = any>(options: FrappeCreateDocOptions<T>) => Promise<FrappeDoc<T>>;
  updateDoc: <T = any>(options: FrappeUpdateDocOptions<T>) => Promise<FrappeDoc<T>>;
  deleteDoc: (options: FrappeDeleteDocOptions) => Promise<void>;
  call: <T = any>(method: string, args?: Record<string, any>) => Promise<T>;
}
