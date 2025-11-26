# Translation Structure Guide

This directory contains all internationalization (i18n) files for the application, organized by language and namespace.

## Directory Structure

```
locales/
├── en/                    # English translations
│   ├── common.json        # General app text
│   ├── buttons.json       # Button labels
│   ├── fields.json        # Form field definitions
│   ├── messages.json      # System messages
│   ├── modals.json        # Modal dialogs
│   ├── dialogs.json       # Alert/confirm dialogs
│   └── pages.json         # Page-specific content
├── vi/                    # Vietnamese translations (same structure)
│   ├── common.json
│   ├── buttons.json
│   ├── fields.json
│   ├── messages.json
│   ├── modals.json
│   ├── dialogs.json
│   └── pages.json
└── README.md             # This file
```

## Namespace Organization

Each namespace serves a specific purpose to keep translations organized and maintainable.

### 1. `common.json` - General Application Text

**Purpose:** App-wide constants and general text that don't fit other categories.

**When to use:**
- App name, branding
- Loading states
- General error messages
- Application-wide constants

**Structure:**
```json
{
  "appName": "Your App Name",
  "loading": "Loading...",
  "error": "An error occurred",
  "notAvailable": "Not available"
}
```

**Usage:**
```tsx
{t('loading')}
{t('appName')}
```

---

### 2. `buttons.json` - Button Labels

**Purpose:** All button text throughout the application.

**When to use:**
- Action buttons (save, cancel, submit)
- Navigation buttons (back, next, finish)
- Authentication buttons (sign in, sign up, sign out)
- CRUD operations (edit, delete, create)

**Structure:**
```json
{
  "save": "Save",
  "cancel": "Cancel",
  "submit": "Submit",
  "close": "Close",
  "edit": "Edit",
  "delete": "Delete",
  "confirm": "Confirm",
  "back": "Back",
  "next": "Next",
  "signIn": "Sign In",
  "signOut": "Sign Out"
}
```

**Usage:**
```tsx
<button>{t('save', { ns: 'buttons' })}</button>
<button>{t('cancel', { ns: 'buttons' })}</button>
```

**Best Practices:**
- Keep button text short and action-oriented
- Use imperative verbs (Save, Delete, Create)
- Avoid full sentences

---

### 3. `fields.json` - Form Field Definitions

**Purpose:** Complete form field definitions including labels, placeholders, descriptions, and validation errors.

**When to use:**
- Form input labels
- Input placeholders
- Field descriptions/help text
- Field-specific validation error messages

**Structure:**
```json
{
  "email": {
    "label": "Email Address",
    "placeholder": "Enter your email",
    "description": "We'll never share your email",
    "errors": {
      "required": "Email is required",
      "invalid": "Please enter a valid email address"
    }
  },
  "password": {
    "label": "Password",
    "placeholder": "Enter your password",
    "description": "Must be at least 8 characters",
    "errors": {
      "required": "Password is required",
      "tooShort": "Password must be at least 8 characters",
      "tooWeak": "Password is too weak"
    }
  }
}
```

**Usage:**
```tsx
<label>{t('email.label', { ns: 'fields' })}</label>
<input placeholder={t('email.placeholder', { ns: 'fields' })} />
<p className="help">{t('email.description', { ns: 'fields' })}</p>
<span className="error">{t('email.errors.required', { ns: 'fields' })}</span>
```

**Best Practices:**
- Group all field-related text together
- Use consistent error message structure
- Include all parts: label, placeholder, description, errors

---

### 4. `messages.json` - System Messages

**Purpose:** Notifications, toasts, alerts, and system-level messages.

**When to use:**
- Success messages (saved, created, updated)
- Error messages (general, network, not found)
- Info messages (processing, loading)
- Warning messages
- Toast notifications

**Structure:**
```json
{
  "welcome": "Welcome back!",
  "goodbye": "See you soon!",
  "success": {
    "saved": "Changes saved successfully",
    "deleted": "Deleted successfully",
    "updated": "Updated successfully",
    "created": "Created successfully"
  },
  "error": {
    "general": "Something went wrong",
    "network": "Network error. Please check your connection",
    "notFound": "Resource not found",
    "unauthorized": "You are not authorized to perform this action"
  },
  "info": {
    "processing": "Processing your request...",
    "loading": "Loading data...",
    "noData": "No data available"
  }
}
```

**Usage:**
```tsx
// With toast library
toast.success(t('success.saved', { ns: 'messages' }));
toast.error(t('error.general', { ns: 'messages' }));

// In component
<div className="alert">{t('info.processing', { ns: 'messages' })}</div>
```

**Best Practices:**
- Categorize by type (success, error, info, warning)
- Keep messages clear and user-friendly
- Provide actionable information when possible

---

### 5. `modals.json` - Modal Dialogs

**Purpose:** Content for modal dialogs that require user interaction.

**When to use:**
- Confirmation modals
- Delete confirmations
- Unsaved changes warnings
- Multi-step modals
- Complex dialog boxes

**Structure:**
```json
{
  "confirmation": {
    "title": "Confirm Action",
    "description": "Are you sure you want to proceed?",
    "confirmButton": "Yes, continue",
    "cancelButton": "Cancel"
  },
  "delete": {
    "title": "Delete Item",
    "description": "Are you sure you want to delete this item? This action cannot be undone.",
    "confirmButton": "Delete",
    "cancelButton": "Cancel"
  },
  "unsavedChanges": {
    "title": "Unsaved Changes",
    "description": "You have unsaved changes. Do you want to save them before leaving?",
    "saveButton": "Save Changes",
    "discardButton": "Discard",
    "cancelButton": "Cancel"
  }
}
```

**Usage:**
```tsx
<Modal>
  <h2>{t('delete.title', { ns: 'modals' })}</h2>
  <p>{t('delete.description', { ns: 'modals' })}</p>
  <button>{t('delete.confirmButton', { ns: 'modals' })}</button>
  <button>{t('delete.cancelButton', { ns: 'modals' })}</button>
</Modal>
```

**Best Practices:**
- Include all modal parts: title, description, buttons
- Make consequences clear in description
- Group related modals together

---

### 6. `dialogs.json` - Alert/Confirm Dialogs

**Purpose:** Simple alert and confirmation dialogs.

**When to use:**
- Simple alerts (OK button only)
- Error dialogs
- Success dialogs
- Info dialogs
- Basic confirmations

**Structure:**
```json
{
  "alert": {
    "title": "Alert",
    "okButton": "OK"
  },
  "error": {
    "title": "Error",
    "description": "An error has occurred",
    "closeButton": "Close"
  },
  "success": {
    "title": "Success",
    "description": "Operation completed successfully",
    "closeButton": "Close"
  },
  "info": {
    "title": "Information",
    "closeButton": "Close"
  }
}
```

**Usage:**
```tsx
<AlertDialog>
  <h3>{t('error.title', { ns: 'dialogs' })}</h3>
  <p>{t('error.description', { ns: 'dialogs' })}</p>
  <button>{t('error.closeButton', { ns: 'dialogs' })}</button>
</AlertDialog>
```

**Best Practices:**
- Use for simple, single-action dialogs
- Keep text brief and clear
- Use modals.json for complex interactions

---

### 7. `pages.json` - Page-Specific Content

**Purpose:** Content specific to individual pages or features.

**When to use:**
- Page titles and headings
- Page descriptions and subtitles
- Page-specific buttons (if not generic)
- Feature-specific content
- Multi-page workflows (login, register, checkout)

**Structure:**
```json
{
  "home": {
    "title": "Welcome to Our App",
    "subtitle": "Get started with your journey",
    "countLabel": "Count"
  },
  "notFound": {
    "title": "Page Not Found",
    "description": "The page you are looking for does not exist.",
    "backButton": "Go Back Home"
  },
  "auth": {
    "login": {
      "title": "Sign In",
      "subtitle": "Welcome back! Please sign in to continue",
      "submitButton": "Sign In",
      "submittingButton": "Signing in...",
      "forgotPassword": "Forgot password?",
      "noAccount": "Don't have an account?",
    },
    "register": {
      "title": "Sign Up",
      "subtitle": "Create your account to get started",
      "submitButton": "Sign Up",
      "submittingButton": "Creating account...",
      "hasAccount": "Already have an account?",
      "signInLink": "Sign in"
    }
  },
  "dashboard": {
    "title": "Dashboard",
    "subtitle": "Overview of your activity",
    "stats": {
      "users": "Total Users",
      "revenue": "Revenue",
      "orders": "Orders"
    }
  }
}
```

**Usage:**
```tsx
function HomePage() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('home.title', { ns: 'pages' })}</h1>
      <p>{t('home.subtitle', { ns: 'pages' })}</p>
    </div>
  );
}

function LoginPage() {
  const { t } = useTranslation();

  return (
    <form>
      <h2>{t('loginPage.title', { ns: 'pages' })}</h2>
      <p>{t('loginPage.subtitle', { ns: 'pages' })}</p>
      <button>{t('loginPage.submitButton', { ns: 'pages' })}</button>
    </form>
  );
}
```

**Best Practices:**
- Group by feature/page (auth, dashboard, profile)
- Use nested structure for related pages
- Keep page-specific content here, not in other namespaces

---

## Decision Tree: Which Namespace to Use?

```
Is it a button?
├─ Yes → buttons.json
└─ No ↓

Is it a form field (label/placeholder/error)?
├─ Yes → fields.json
└─ No ↓

Is it a toast notification or system message?
├─ Yes → messages.json
└─ No ↓

Is it a complex modal with multiple actions?
├─ Yes → modals.json
└─ No ↓

Is it a simple alert/confirm dialog?
├─ Yes → dialogs.json
└─ No ↓

Is it specific to a particular page/feature?
├─ Yes → pages.json
└─ No → common.json
```

## Adding New Translations

### Step 1: Choose the Right Namespace
Use the decision tree above to determine which file to edit.

### Step 2: Add to English File
**Example:** Adding a new button

`locales/en/buttons.json`:
```json
{
  "save": "Save",
  "cancel": "Cancel",
  "export": "Export",  // ← Add here
  "import": "Import"   // ← Add here
}
```

### Step 3: Add to All Other Languages
`locales/vi/buttons.json`:
```json
{
  "save": "Lưu",
  "cancel": "Hủy",
  "export": "Xuất",    // ← Add Vietnamese
  "import": "Nhập"     // ← Add Vietnamese
}
```

### Step 4: Use in Component
```tsx
<button>{t('export', { ns: 'buttons' })}</button>
```

## Adding a New Page

When adding a new page, add all its translations to `pages.json`:

```json
{
  "home": { /* ... */ },
  "myNewPage": {           // ← Add new page
    "title": "My New Page",
    "subtitle": "Page description",
    "sections": {
      "overview": "Overview",
      "details": "Details"
    },
    "actions": {
      "create": "Create New",
      "view": "View All"
    }
  }
}
```

## Best Practices

### ✅ DO:
- Keep translations organized by namespace
- Use descriptive, nested keys for clarity
- Maintain consistent structure across all languages
- Group related translations together
- Use the decision tree to choose the right namespace

### ❌ DON'T:
- Mix different types of content in one namespace
- Put button text in pages.json or fields.json
- Use generic keys like "text1", "label2"
- Skip translations for any language
- Hardcode strings in components

## Common Patterns

### Pattern 1: Form with Validation
```tsx
function MyForm() {
  const { t } = useTranslation();

  return (
    <form>
      <label>{t('email.label', { ns: 'fields' })}</label>
      <input
        placeholder={t('email.placeholder', { ns: 'fields' })}
        error={t('email.errors.required', { ns: 'fields' })}
      />
      <button>{t('submit', { ns: 'buttons' })}</button>
    </form>
  );
}
```

### Pattern 2: CRUD Operations
```tsx
function DataTable() {
  const { t } = useTranslation();

  const handleDelete = () => {
    if (confirm(t('delete.description', { ns: 'modals' }))) {
      deleteItem();
      toast.success(t('success.deleted', { ns: 'messages' }));
    }
  };

  return (
    <div>
      <button>{t('edit', { ns: 'buttons' })}</button>
      <button onClick={handleDelete}>
        {t('delete', { ns: 'buttons' })}
      </button>
    </div>
  );
}
```

### Pattern 3: Page with Multiple Sections
```tsx
function DashboardPage() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('dashboard.title', { ns: 'pages' })}</h1>
      <p>{t('dashboard.subtitle', { ns: 'pages' })}</p>

      <section>
        <h2>{t('dashboard.stats.users', { ns: 'pages' })}</h2>
        <span>{t('loading', { ns: 'common' })}</span>
      </section>
    </div>
  );
}
```

## TypeScript Support

All translation keys are type-checked. TypeScript will autocomplete and validate:

```tsx
// ✓ Valid - TypeScript autocompletes and validates
t('save', { ns: 'buttons' })
t('email.label', { ns: 'fields' })
t('home.title', { ns: 'pages' })

// ✗ TypeScript error - invalid key
t('invalidKey', { ns: 'buttons' })
t('notExists', { ns: 'fields' })
```

## Questions?

**Q: Should I put a page-specific button in buttons.json or pages.json?**
A: If it's a generic action (save, cancel), use `buttons.json`. If it's page-specific text (like "Start Your Journey"), use `pages.json`.

**Q: Where do I put navigation menu items?**
A: Use `common.json` for main navigation or `pages.json` if tied to specific pages.

**Q: Can I create a new namespace?**
A: Yes, but first check if existing namespaces fit. If you need a new one, update `src/lib/i18n.ts` and `src/types/i18n.d.ts`.

**Q: What if a translation fits multiple categories?**
A: Use the decision tree. When in doubt, choose based on primary usage context.

## See Also

- [Main i18n Guide](/I18N_GUIDE.md) - Complete internationalization documentation
- [i18n Configuration](/src/lib/i18n.ts) - i18next setup
- [TypeScript Types](/src/types/i18n.d.ts) - Type definitions
