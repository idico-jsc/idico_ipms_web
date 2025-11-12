# Internationalization (i18n) Guide

This project uses **react-i18next** for internationalization. Translation support has been implemented with English (en) and Vietnamese (vi) languages.

## Features

- Auto-detect browser language
- Persistent language preference (localStorage)
- Type-safe translation keys with TypeScript
- Easy language switching via UI component
- Organized translation structure by domain

## Project Structure

```
src/
├── lib/
│   └── i18n.ts                      # i18n configuration
├── providers/
│   ├── providers.tsx                # Combined providers wrapper
│   └── I18nProvider.tsx             # i18n React provider
├── locales/
│   ├── en/                          # English translations
│   │   ├── common.json              # Common/general text
│   │   ├── buttons.json             # All button texts
│   │   ├── fields.json              # Form field labels, placeholders, errors
│   │   ├── messages.json            # Success/error/info messages
│   │   ├── modals.json              # Common modal dialogs
│   │   ├── dialogs.json             # Alert/confirm dialogs
│   │   └── pages.json               # Page-specific translations
│   └── vi/                          # Vietnamese translations (same structure)
│       ├── common.json
│       ├── buttons.json
│       ├── fields.json
│       ├── messages.json
│       ├── modals.json
│       ├── dialogs.json
│       └── pages.json
├── hooks/
│   └── useLanguage.ts               # Language switching hook
├── components/
│   └── molecules/
│       └── language-switcher.tsx    # Language picker component
├── constants/
│   └── languages.ts                 # Supported languages config
└── types/
    └── i18n.d.ts                    # TypeScript definitions
```

## Translation Namespaces

### 1. **common.json** - General application text
```json
{
  "appName": "React-TS Starter",
  "loading": "Loading...",
  "error": "An error occurred"
}
```

### 2. **buttons.json** - All button text
```json
{
  "save": "Save",
  "cancel": "Cancel",
  "submit": "Submit",
  "signIn": "Sign In"
}
```

### 3. **fields.json** - Form fields (labels, placeholders, validation errors)
```json
{
  "email": {
    "label": "Email",
    "placeholder": "Enter your email",
    "errors": {
      "required": "Email is required",
      "invalid": "Invalid email"
    }
  }
}
```

### 4. **messages.json** - System messages
```json
{
  "success": {
    "saved": "Saved successfully"
  },
  "error": {
    "general": "Something went wrong"
  }
}
```

### 5. **modals.json** - Common modal dialogs
```json
{
  "confirmation": {
    "title": "Confirm Action",
    "description": "Are you sure?"
  }
}
```

### 6. **dialogs.json** - Alert/confirm dialogs
```json
{
  "alert": {
    "title": "Alert",
    "okButton": "OK"
  }
}
```

### 7. **pages.json** - Page-specific translations
```json
{
  "home": {
    "title": "Welcome",
    "subtitle": "Get started"
  },
  "auth": {
    "login": {
      "title": "Sign In"
    }
  }
}
```

## Usage Examples

### Basic Usage

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      {/* From common namespace (default) */}
      <div>{t('loading')}</div>

      {/* From buttons namespace */}
      <button>{t('save', { ns: 'buttons' })}</button>

      {/* From fields namespace */}
      <label>{t('email.label', { ns: 'fields' })}</label>

      {/* From pages namespace */}
      <h1>{t('home.title', { ns: 'pages' })}</h1>
    </div>
  );
}
```

### Form Example

```tsx
function LoginForm() {
  const { t } = useTranslation();

  return (
    <form>
      <div>
        <label>{t('email.label', { ns: 'fields' })}</label>
        <input
          type="email"
          placeholder={t('email.placeholder', { ns: 'fields' })}
        />
        <span className="error">
          {t('email.errors.required', { ns: 'fields' })}
        </span>
      </div>

      <button type="submit">
        {t('sign_in', { ns: 'buttons' })}
      </button>
    </form>
  );
}
```

### Messages Example

```tsx
function MyComponent() {
  const { t } = useTranslation();

  const handleSave = async () => {
    try {
      await saveData();
      toast.success(t('success.saved', { ns: 'messages' }));
    } catch (error) {
      toast.error(t('error.general', { ns: 'messages' }));
    }
  };

  return <button onClick={handleSave}>{t('save', { ns: 'buttons' })}</button>;
}
```

### Modal Example

```tsx
function DeleteConfirmModal() {
  const { t } = useTranslation();

  return (
    <Modal>
      <h2>{t('delete.title', { ns: 'modals' })}</h2>
      <p>{t('delete.description', { ns: 'modals' })}</p>
      <button>{t('delete.confirmButton', { ns: 'modals' })}</button>
      <button>{t('delete.cancelButton', { ns: 'modals' })}</button>
    </Modal>
  );
}
```

## Language Switching

### Using the useLanguage Hook

```tsx
import { useLanguage } from '@/hooks/useLanguage';

function MyComponent() {
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguage();

  return (
    <select
      value={currentLanguage}
      onChange={(e) => changeLanguage(e.target.value)}
    >
      {supportedLanguages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.flag} {lang.nativeName}
        </option>
      ))}
    </select>
  );
}
```

### Using the LanguageSwitcher Component

```tsx
import { LanguageSwitcher } from '@/components/molecules/language-switcher';

function Header() {
  return (
    <header>
      <LanguageSwitcher variant="outline" />
    </header>
  );
}
```

## Adding New Translations

### Option 1: Add to Existing Namespace

Add translations to the appropriate existing file:

**src/locales/en/buttons.json:**
```json
{
  "save": "Save",
  "cancel": "Cancel",
  "export": "Export",     // Add new
  "import": "Import"      // Add new
}
```

**src/locales/vi/buttons.json:**
```json
{
  "save": "Lưu",
  "cancel": "Hủy",
  "export": "Xuất",       // Add Vietnamese
  "import": "Nhập"        // Add Vietnamese
}
```

**Use in component:**
```tsx
<button>{t('export', { ns: 'buttons' })}</button>
```

### Option 2: Add New Page Translations

Add page-specific translations to `pages.json`:

**src/locales/en/pages.json:**
```json
{
  "home": { "title": "Home" },
  "dashboard": {           // Add new page
    "title": "Dashboard",
    "subtitle": "Overview",
    "stats": {
      "users": "Total Users",
      "revenue": "Revenue"
    }
  }
}
```

**Use in component:**
```tsx
function Dashboard() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('dashboard.title', { ns: 'pages' })}</h1>
      <p>{t('dashboard.subtitle', { ns: 'pages' })}</p>
      <div>{t('dashboard.stats.users', { ns: 'pages' })}</div>
    </div>
  );
}
```

### Option 3: Add New Form Fields

**src/locales/en/fields.json:**
```json
{
  "email": { "label": "Email", "errors": { "required": "Required" } },
  "phone": {               // Add new field
    "label": "Phone Number",
    "placeholder": "Enter phone number",
    "errors": {
      "required": "Phone is required",
      "invalid": "Invalid phone number"
    }
  }
}
```

## Adding a New Language

### 1. Add Language Constant

**src/constants/languages.ts:**
```typescript
export const LANGUAGES = {
  EN: 'en',
  VI: 'vi',
  FR: 'fr', // Add new
} as const;

export const SUPPORTED_LANGUAGES: Language[] = [
  // ... existing
  {
    code: LANGUAGES.FR,
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
  },
];
```

### 2. Create Translation Files

Create all namespace files:
- `src/locales/fr/common.json`
- `src/locales/fr/buttons.json`
- `src/locales/fr/fields.json`
- `src/locales/fr/messages.json`
- `src/locales/fr/modals.json`
- `src/locales/fr/dialogs.json`
- `src/locales/fr/pages.json`

### 3. Register in i18n Config

**src/lib/i18n.ts:**
```typescript
// Import French files
import frCommon from '@/locales/fr/common.json';
import frButtons from '@/locales/fr/buttons.json';
// ... import all namespaces

const resources = {
  en: { /* ... */ },
  vi: { /* ... */ },
  fr: {  // Add here
    common: frCommon,
    buttons: frButtons,
    fields: frFields,
    messages: frMessages,
    modals: frModals,
    dialogs: frDialogs,
    pages: frPages,
  },
};
```

## Best Practices

### 1. **Choose the Right Namespace**

- **buttons.json** → All button text (save, cancel, submit)
- **fields.json** → Form labels, placeholders, field errors
- **messages.json** → Toast messages, notifications, alerts
- **modals.json** → Modal dialog content (title, description, buttons)
- **dialogs.json** → Simple alert/confirm dialogs
- **pages.json** → Page-specific content (headings, descriptions)
- **common.json** → App-wide constants (app name, loading states)

### 2. **Use Descriptive Keys**

```json
// Good
{
  "email": {
    "label": "Email Address",
    "errors": {
      "required": "Email is required",
      "invalid": "Invalid email format"
    }
  }
}

// Bad
{
  "field1": "Email",
  "error1": "Required"
}
```

### 3. **Keep Structure Consistent**

Maintain the same JSON structure across all language files:

```json
// en/fields.json
{
  "email": {
    "label": "Email",
    "placeholder": "Enter email"
  }
}

// vi/fields.json
{
  "email": {
    "label": "Email",
    "placeholder": "Nhập email"
  }
}
```

### 4. **Group Related Translations**

```json
// pages.json
{
  "auth": {
    "login": {
      "title": "Sign In",
      "subtitle": "Welcome back"
    },
    "register": {
      "title": "Sign Up",
      "subtitle": "Create account"
    }
  }
}
```

### 5. **Avoid Hardcoded Strings**

```tsx
// Bad
<button>Save</button>

// Good
<button>{t('save', { ns: 'buttons' })}</button>
```

## TypeScript Support

The project includes full TypeScript support with autocomplete and type checking:

```tsx
// TypeScript will autocomplete and validate keys
t('save', { ns: 'buttons' })           // ✓ Valid
t('email.label', { ns: 'fields' })     // ✓ Valid
t('invalidKey', { ns: 'buttons' })     // ✗ TypeScript error
```

## Configuration

### Default Language
Set in `src/constants/languages.ts`:
```typescript
export const DEFAULT_LANGUAGE = LANGUAGES.EN;
```

### Language Detection Order
Configured in `src/lib/i18n.ts`:
1. localStorage (persisted user choice)
2. Browser navigator language

### Storage Key
Language preference is stored in localStorage with key: `i18nextLng`

## Available Namespaces

1. **common** - General application text
2. **buttons** - Button labels (save, cancel, submit, etc.)
3. **fields** - Form fields (labels, placeholders, validation errors)
4. **messages** - Success/error/info messages
5. **modals** - Common modal dialog content
6. **dialogs** - Alert/confirm dialog content
7. **pages** - Page-specific translations (home, auth, dashboard, etc.)

## Components Updated

- `src/page/Home.tsx` - Home page with language switcher
- `src/page/NotFound.tsx` - 404 page
- `src/features/auth/components/LoginForm.tsx` - Login form with field labels and placeholders

## Testing

Run the development server and test language switching:
```bash
npm run dev
```

Navigate to the home page and use the language switcher in the top-right corner.

## Tips

1. **Use the right namespace** - Don't put button text in fields.json
2. **Be specific** - Use nested objects for clarity (auth.login.title)
3. **Stay consistent** - Match structure across all languages
4. **Think ahead** - Structure translations for easy expansion
5. **Test both languages** - Verify all strings translate correctly
