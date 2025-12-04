# Phone Authentication Setup

This guide explains how to configure and use Firebase phone authentication in the application.

## Setup Instructions

### 1. Configure Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project or create a new one
3. Navigate to **Authentication** → **Sign-in method**
4. Enable **Phone** authentication provider

### 2. Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click on your web app or create a new one
4. Copy the Firebase configuration values

### 3. Update Environment Variables

Update your `.env.development` file with your Firebase configuration:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
```

Replace the placeholder values with your actual Firebase configuration.

### 4. Configure Authorized Domains

1. In Firebase Console, go to **Authentication** → **Settings** → **Authorized domains**
2. Add your domains:
   - `localhost` (for local development)
   - Your production domain (e.g., `yourdomain.com`)

## How It Works

### User Flow

1. User clicks **"Continue with Phone"** button on the login page
2. A modal opens asking for phone number
3. User enters phone number in E.164 format (e.g., `+1234567890`)
4. Firebase sends OTP to the phone number
5. Verification ID is generated and logged to console
6. User enters the 6-digit OTP code
7. On successful verification, the modal closes and success callback is triggered

### Implementation Details

**Files Created:**
- `src/config/firebase.ts` - Firebase initialization
- `src/features/auth/components/phone-auth-button.tsx` - Phone login button
- `src/features/auth/components/phone-auth-modal.tsx` - Phone auth modal with OTP flow

**Modified Files:**
- `src/features/auth/components/login-form.tsx` - Integrated phone auth button

### Key Features

- ✅ Phone number input with country code validation
- ✅ Invisible reCAPTCHA verification
- ✅ OTP verification flow
- ✅ Verification ID logging to console
- ✅ Error handling and user feedback
- ✅ Loading states and disabled states
- ✅ Clean modal UI with step-by-step flow

## Usage

### Phone Number Format

Phone numbers must be in E.164 format:
- Start with `+` and country code
- No spaces or special characters
- Examples:
  - US: `+11234567890`
  - UK: `+441234567890`
  - India: `+919876543210`

### Console Output

When OTP is sent successfully, you'll see in the console:
```
Verification ID: AMwX7Yzs...
```

When phone authentication succeeds, you'll see:
```
Phone authentication successful!
Phone Number: +1234567890
Verification ID: AMwX7Yzs...
```

## Backend Integration

The current implementation handles the Firebase authentication flow. To complete the integration:

1. Add a backend API endpoint to verify Firebase phone authentication
2. Send the verification ID to your backend
3. Backend should verify with Firebase and issue your app's auth token
4. Similar to how Google OAuth is integrated in `src/features/auth/services/api.ts`

Example endpoint to add:
```typescript
// In src/features/auth/constants/endpoints.ts
export const AUTH_ENDPOINTS = {
  // ... existing endpoints
  LOGIN_PHONE: "/method/ws_hrm.api.phone_login.login_via_phone",
} as const;

// In src/features/auth/services/api.ts
export async function loginWithPhone(
  phoneNumber: string,
  verificationId: string,
): Promise<AuthResponse> {
  const response = await apiPost<AuthResponse>(
    AUTH_ENDPOINTS.LOGIN_PHONE,
    { phone_number: phoneNumber, verification_id: verificationId, use_jwt: 1 },
    { requireAuth: false }
  );
  return response;
}
```

## Testing

### Development Testing

Firebase provides test phone numbers for development:

1. Go to **Authentication** → **Sign-in method** → **Phone**
2. Expand **Phone numbers for testing**
3. Add test phone numbers with specific verification codes
4. Example: `+1 555 555 5555` → `123456`

### Production Testing

For production:
1. Use real phone numbers
2. Ensure your Firebase project has billing enabled (required for SMS)
3. Monitor SMS quotas in Firebase Console

## Troubleshooting

### "reCAPTCHA not working"
- Ensure your domain is in Firebase's authorized domains
- Check browser console for reCAPTCHA errors
- Verify Firebase configuration is correct

### "SMS not received"
- Check phone number format (must be E.164)
- Verify Firebase project has billing enabled
- Check Firebase quotas and limits
- Use test phone numbers for development

### "Build errors"
- Run `npm install firebase --legacy-peer-deps`
- Ensure TypeScript types are up to date

## Security Notes

- Phone authentication uses Firebase's secure infrastructure
- reCAPTCHA prevents abuse and bot attacks
- Never expose Firebase API keys in public repositories (use environment variables)
- Implement rate limiting on your backend
- Consider adding phone number verification cooldowns
