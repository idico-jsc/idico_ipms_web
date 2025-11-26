import type { FrappeUser } from "@/types/frappe.types";
import { apiGet, apiPost } from "@/utils";
import { AuthResponse } from "../types/auth.types";
import { AUTH_ENDPOINTS } from "../constants/endpoints";

/**
 * Login with username and password
 */
export async function loginWithCredentials(
  username: string,
  password: string,
): Promise<AuthResponse> {
  try {
    const response = await apiPost<AuthResponse>(
      AUTH_ENDPOINTS.LOGIN,
      { usr: username, pwd: password, use_jwt: 1 },
      {
        requireAuth: false,
      },
    );

    return response;
  } catch (error) {
    throw error;
  }
}

/**
 * Login with Google OAuth
 * Sends Google ID token (JWT credential) to Frappe backend for verification
 */
export async function loginWithGoogle(
  idToken: string,
): Promise<AuthResponse> {
  try {
    const response = await apiPost<AuthResponse>(
      AUTH_ENDPOINTS.LOGIN_GOOGLE,
      { id_token: idToken, use_jwt: 1 },
      {
        requireAuth: false,
      },
    );

    return response;
  } catch (error) {
    throw error;
  }
}

/** Logout
 */
export async function logout(): Promise<void> {
  try {
    await apiPost<void>(
      AUTH_ENDPOINTS.LOGOUT,
      {},
      {
        requireAuth: true,
      },
    );
  } catch (error) {
    throw error;
  }
}

/**
 * Request password reset
 * Sends password reset email to user
 */
export async function forgotPassword(email: string): Promise<{ message: string }> {
  try {
    const response = await apiPost<{ message: string }>(
      AUTH_ENDPOINTS.FORGOT_PASSWORD,
      { email },
      {
        requireAuth: false,
      },
    );
    return response;
  } catch (error) {
    throw error;
  }
}

/**
 * Reset password with token
 * Updates user password using reset token
 */
export async function resetPassword(
  token: string,
  newPassword: string,
): Promise<{ message: string }> {
  try {
    const response = await apiPost<{ message: string }>(
      AUTH_ENDPOINTS.RESET_PASSWORD,
      {
        key: token,
        new_password: newPassword,
      },
      {
        requireAuth: false,
      },
    );
    return response;
  } catch (error) {
    throw error;
  }
} 

/** Get current user profile */
export async function getCurrentUser(): Promise<FrappeUser> {
  try {

    const response = await apiGet<{ message: FrappeUser }>(
      AUTH_ENDPOINTS.GET_CURRENT_USER,
    );
    return response.message;
  } catch (error) {
    throw error;
  }
}
