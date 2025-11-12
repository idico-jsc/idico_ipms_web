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
