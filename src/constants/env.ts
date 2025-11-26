/**
 * Environment Constants
 *
 * Purpose: Centralized access to environment variables
 * Why: Avoid using import.meta.env directly throughout the codebase
 * Benefits:
 * - Type safety
 * - Single source of truth
 * - Easy to mock in tests
 * - Better error handling for missing env vars
 */

// Application Version
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '0.0.0';

// Auth & Security
export const RETRY_DELAY = Number(import.meta.env.VITE_RETRY_DELAY) || 30;
const passwordStrengthEnv = import.meta.env.VITE_PASSWORD_STRENGTH ?? import.meta.env.VITE_PASSWORD_STRENGHTH;
export const PASSWORD_STRENGTH_THRESHOLD = Number(passwordStrengthEnv) || 2;
export const AUTO_REDIRECT_DELAY = Number(import.meta.env.VITE_AUTO_REDIRECT_DELAY) || 5;

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://jsonplaceholder.typicode.com';
export const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000;

// Google OAuth
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

// Frappe Configuration
export const FRAPPE_URL = import.meta.env.VITE_FRAPPE_URL || '';
export const FRAPPE_USE_TOKEN = import.meta.env.VITE_FRAPPE_USE_TOKEN === 'true';
export const FRAPPE_TOKEN_EXPIRY_DAYS = Number(import.meta.env.VITE_FRAPPE_TOKEN_EXPIRY_DAYS) || 7;

// Application Environment
export const APP_ENV = import.meta.env.MODE || 'development';
export const IS_DEV = import.meta.env.DEV;
export const IS_PROD = import.meta.env.PROD;

// Feature Flags
export const ENABLE_DEBUG = import.meta.env.VITE_ENABLE_DEBUG === 'true';
