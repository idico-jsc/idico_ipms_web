# Google OAuth Setup Guide

This guide explains how to configure Google OAuth for the application.

## Prerequisites

- A Google Cloud Platform account
- Admin access to Google Cloud Console
- Your Frappe backend URL

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Select a project** → **New Project**
3. Enter project name (e.g., "Parent Portal")
4. Click **Create**

## Step 2: Enable Google+ API

1. In your project, go to **APIs & Services** → **Library**
2. Search for "Google+ API"
3. Click on it and press **Enable**

## Step 3: Create OAuth 2.0 Credentials

### Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Select **External** (or Internal if using Google Workspace)
3. Click **Create**
4. Fill in the required information:
   - **App name**: Your application name (e.g., "Parent Portal")
   - **User support email**: Your email
   - **Developer contact email**: Your email
5. Click **Save and Continue**
6. Skip **Scopes** section (click Save and Continue)
7. Add test users if needed (for External apps in testing mode)
8. Click **Save and Continue**

### Create OAuth Client ID

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Select **Application type**: **Web application**
4. Enter a name (e.g., "Parent Portal Web Client")

5. **Authorized JavaScript origins**: Add your frontend URLs (THIS IS CRITICAL!)
   ```
   Development (add ALL of these):
   http://localhost:5173
   http://localhost:3000
   http://127.0.0.1:5173
   http://127.0.0.1:3000

   Production:
   https://your-domain.com
   ```

   **IMPORTANT**:
   - Add the EXACT URL you see in your browser's address bar
   - No trailing slashes (/)
   - Include the port number
   - `localhost` and `127.0.0.1` are different origins - add both if needed
   - Changes may take 5-10 minutes to propagate

6. **Authorized redirect URIs**: Not needed for implicit flow (we use popup mode)
   - If you switch to auth-code flow later, you'll need to add:
     ```
     http://localhost:8000/api/method/ws_hrm.api.google_login.login_via_google_id_token
     https://your-frappe-server.com/api/method/ws_hrm.api.google_login.login_via_google_id_token
     ```

7. Click **Create**
8. **Copy your Client ID** - you'll need this for the next steps

## Step 4: Configure Frontend Environment Variables

1. Open `.env.development` file in your project root
2. Add your Google Client ID:
   ```env
   VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
   ```

3. For production, add the same to `.env.production`:
   ```env
   VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
   ```

## Step 5: Configure Frappe Backend

Your Frappe backend should already have the Social Login Key configured. Verify:

1. Login to Frappe Desk
2. Go to **Desktop** → **Integration** → **Social Login Key**
3. Find the Google OAuth configuration
4. Verify these settings:
   - **Provider Name**: Google
   - **Client ID**: Your Google OAuth Client ID
   - **Client Secret**: Your Google OAuth Client Secret (from Google Cloud Console)
   - **Enable Social Login**: Checked
   - **Custom Base URL**: (if needed for custom domains)

## Step 6: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the login page
3. Click the **Google** button
4. A popup window will open with Google's OAuth consent screen
5. After authorizing, the popup will close and you should be logged into the application

**Note**: We use the official `GoogleLogin` component which provides an **ID token** (JWT credential). This token contains user information and is sent to your Frappe backend for verification. No redirect URIs are needed.

## Troubleshooting

### Error: "The given origin is not allowed for the given client ID"

**Problem**: Your frontend URL (origin) is not authorized in Google Cloud Console.

**Solution**:
1. Check your current URL in the browser (e.g., `http://localhost:5173`)
2. Go to [Google Cloud Console](https://console.cloud.google.com/)
3. Navigate to: **APIs & Services** → **Credentials**
4. Click on your OAuth 2.0 Client ID
5. Under **Authorized JavaScript origins**, click **+ ADD URI**
6. Add the EXACT origin from your browser:
   - ✅ `http://localhost:5173` (correct)
   - ❌ `http://localhost:5173/` (wrong - has trailing slash)
   - ❌ `http://localhost` (wrong - missing port)
7. Click **Save**
8. Wait 5-10 minutes for changes to take effect
9. Clear browser cache and try again

**Common mistakes**:
- Forgot to add port number: `http://localhost` instead of `http://localhost:5173`
- Added trailing slash: `http://localhost:5173/`
- Mixed up `localhost` vs `127.0.0.1` - they're different origins!
- Didn't wait for Google to propagate changes (takes 5-10 min)

**Quick test**: After adding, run this in browser console:
```javascript
console.log(window.location.origin);
// This should match EXACTLY what you added in Google Cloud Console
```

### Error: "redirect_uri_mismatch"

**Problem**: The redirect URI doesn't match what's configured in Google Cloud Console.

**Solution**:
- Check that the redirect URI in Google Cloud Console matches exactly:
  - For development: `http://localhost:8000` or your Frappe dev URL
  - Must match the protocol (http vs https)
  - Must match the port number
  - No trailing slashes

### Error: "Invalid Client ID"

**Problem**: The Client ID in `.env` doesn't match Google Cloud Console.

**Solution**:
- Copy the Client ID from Google Cloud Console again
- Make sure there are no extra spaces or characters
- Restart your dev server after changing `.env`

### Google Login Button Doesn't Appear

**Problem**: `VITE_GOOGLE_CLIENT_ID` is not configured.

**Solution**:
- Check `.env.development` has the Client ID
- Make sure the variable name is exactly `VITE_GOOGLE_CLIENT_ID`
- Restart your dev server
- Check browser console for warnings

### Error: "Access blocked: This app's request is invalid"

**Problem**: OAuth consent screen not configured properly or app is in testing mode.

**Solution**:
- Complete the OAuth consent screen configuration in Google Cloud Console
- If app is in testing mode, add your email as a test user
- For production, publish the OAuth consent screen

### Backend Returns 401 or Authentication Error

**Problem**: Frappe backend configuration issue or ID token verification failed.

**Solution**:
- Verify Social Login Key is configured in Frappe
- Check that Client ID and Client Secret match Google Cloud Console
- Ensure the Frappe backend endpoint accepts `id_token` parameter (JWT token from Google)
- The backend should verify the ID token signature using Google's public keys
- Ensure the Frappe user's email matches the Google account email
- Check Frappe error logs: `bench logs`

**Example ID token payload** (decoded JWT):
```json
{
  "iss": "https://accounts.google.com",
  "sub": "116382385594823481504",
  "email": "user@wellspringsaigon.edu.vn",
  "email_verified": true,
  "name": "User Name",
  "picture": "https://...",
  "iat": 1749632260,
  "exp": 1749635860
}
```

### CORS Errors

**Problem**: CORS policy blocking requests between frontend and backend.

**Solution**:
- Ensure your frontend URL is added to Frappe's allowed origins
- Check Frappe's CORS configuration in `site_config.json`
- For development, ensure both frontend and backend are on same domain or CORS is properly configured

## Security Notes

1. **Never commit** your `.env` files to version control
2. **Keep your Client Secret secure** - only store it on the backend
3. **Use environment-specific credentials** - different Client IDs for dev/prod
4. **Regularly rotate secrets** in production environments
5. **Monitor OAuth usage** in Google Cloud Console

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [@react-oauth/google Documentation](https://www.npmjs.com/package/@react-oauth/google)
- [Frappe OAuth Documentation](https://frappeframework.com/docs/v14/user/en/guides/integration/oauth)

## Need Help?

If you encounter issues not covered here:
1. Check browser console for detailed error messages
2. Check Frappe backend logs: `bench logs`
3. Verify all URLs match exactly (protocol, domain, port)
4. Ensure OAuth consent screen is properly configured
5. Check that test users are added if app is in testing mode
