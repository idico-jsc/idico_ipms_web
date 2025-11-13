export const AUTH_ENDPOINTS = {
  LOGIN: "/method/login",
  LOGIN_GOOGLE: "/method/ws_hrm.api.google_login.login_via_google_id_token",
  GET_CURRENT_USER: "/method/parent_portal.api.login.get_current_user_info",
  LOGOUT: "/method/logout",
} as const;
