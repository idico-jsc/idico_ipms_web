/**
 * Mock Authentication Hook for Development
 *
 * IMPORTANT: This is for DEVELOPMENT ONLY.
 * Remove this file and all references when deploying to production.
 *
 * Provides mock authentication for testing with predefined users:
 * - tenant@test.com - Customer/Tenant role
 * - staff@test.com - Staff/Employee role
 * - admin@test.com - System Manager/Admin role
 */

import { useAuthStore } from '../store/auth-store';
import { isMockUser, getMockUser, generateMockToken } from '@/data/mock-users';

/**
 * Mock Authentication Hook
 *
 * Use this hook for development/demo purposes only.
 * It bypasses real API authentication for predefined test users.
 */
export function useAuthDemo() {
  const saveMockAuth = useAuthStore((state) => state.saveMockAuth);
  const setLoading = useAuthStore((state) => state.setLoading);
  const setError = useAuthStore((state) => state.setError);
  const isLoading = useAuthStore((state) => state.isLoading);

  /**
   * Mock login function
   *
   * Checks if email belongs to a mock user and logs them in instantly.
   * Returns true if mock user was found and logged in, false otherwise.
   *
   * @param email - User email to check
   * @param password - Password (ignored for mock users)
   * @returns Promise<boolean> - true if mock login successful, false if not a mock user
   */
  const loginDemo = async (email: string): Promise<boolean> => {
    // Check if this is a mock user
    if (!isMockUser(email)) {
      return Promise.reject()
    }

    setLoading(true);
    setError(null);

    try {
      // Get mock user data
      const mockUser = getMockUser(email);
      console.log(mockUser);
      
      if (!mockUser) {
        throw new Error('Mock user not found');
      }

      // Generate mock token
      const mockToken = generateMockToken(email);

      // Save mock auth (token + user) without calling API
      saveMockAuth(mockUser, mockToken);

      return true; // Mock login successful
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Mock login failed';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  };

  /**
   * Check if an email is a mock user
   */
  const isMockEmail = (email: string): boolean => {
    return isMockUser(email);
  };

  return {
    loginDemo,
    isMockEmail,
    isLoading,
  };
}
