/*
Desc:
Purpose: To store reusable constants that can be used across your application.
Why: Avoid hardcoding values (e.g., API URLs, static text, colors, or
configuration values) directly in components or functions.
*/

// Environment constants
export * from './env';
// Frappe constants
export * from './frappe';
export * from './languages';
// Re-export version utilities
export { getAppVersion } from './version';
