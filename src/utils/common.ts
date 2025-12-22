export const cleanPath = (path: string) => {
  // Remove leading/trailing slashes and duplicate slashes
  // Don't remove slashes of the protocol (http:// or https://)
  return path.replace(/([^:]\/)\/+/g, '$1').replace(/(^\/+|\/+$)/g, '');
};

export function isAbsoluteURL(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Get user initials from full name
 * @param name - Full name of the user
 * @returns Initials (max 2 characters, uppercase)
 * @example
 * getInitials('John Doe') // 'JD'
 * getInitials('John') // 'J'
 * getInitials('John Paul Smith') // 'JP'
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
