# Services Feature Module

This module contains all service request-related components, hooks, and utilities.

## Structure

```
src/features/services/
├── components/           # UI Components
│   ├── create-service-request-dialog.tsx
│   ├── edit-service-request-dialog.tsx
│   ├── delete-service-request-dialog.tsx
│   ├── service-request-form.tsx
│   ├── request-type-selector.tsx
│   ├── status-progress-bar.tsx
│   └── index.ts
├── hooks/               # Custom Hooks
│   ├── use-service-request-form.ts
│   └── index.ts
├── utils/               # Utility Functions
│   ├── service-helpers.ts
│   └── index.ts
└── index.ts             # Barrel export
```

## Components

### 1. CreateServiceRequestDialog

Dialog for creating new service requests.

**Props:**
- `open: boolean` - Dialog open state
- `onOpenChange: (open: boolean) => void` - Open state change handler
- `formData: ServiceRequestFormData` - Form data
- `formErrors: Partial<Record<keyof ServiceRequestFormData, string>>` - Validation errors
- `onFormDataChange: (data: ServiceRequestFormData) => void` - Form data change handler
- `onSubmit: () => void` - Submit handler

**Example:**
```tsx
import { CreateServiceRequestDialog, useServiceRequestForm } from '@/features/services';

const {
  formData,
  formErrors,
  validateForm,
  resetForm,
  updateFormData
} = useServiceRequestForm();

<CreateServiceRequestDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  formData={formData}
  formErrors={formErrors}
  onFormDataChange={updateFormData}
  onSubmit={handleCreate}
/>
```

### 2. EditServiceRequestDialog

Dialog for editing existing service requests. Same props as CreateServiceRequestDialog.

**Example:**
```tsx
<EditServiceRequestDialog
  open={isEditOpen}
  onOpenChange={setIsEditOpen}
  formData={formData}
  formErrors={formErrors}
  onFormDataChange={updateFormData}
  onSubmit={handleEdit}
/>
```

### 3. DeleteServiceRequestDialog

Alert dialog for confirming service request deletion.

**Props:**
- `open: boolean` - Dialog open state
- `onOpenChange: (open: boolean) => void` - Open state change handler
- `request: ServiceRequest | null` - Request to delete
- `onConfirm: () => void` - Confirmation handler

**Example:**
```tsx
import { DeleteServiceRequestDialog } from '@/features/services';

<DeleteServiceRequestDialog
  open={isDeleteOpen}
  onOpenChange={setIsDeleteOpen}
  request={selectedRequest}
  onConfirm={handleDelete}
/>
```

### 4. ServiceRequestForm

Reusable form component with all service request fields.

**Fields:**
- Request Type (card selector - 2x2 grid)
- Priority (select dropdown)
- Description (textarea)
- Location (text input)
- Images (drag-and-drop upload)

**Example:**
```tsx
import { ServiceRequestForm } from '@/features/services';

<ServiceRequestForm
  formData={formData}
  formErrors={formErrors}
  onChange={updateFormData}
  onError={setFormErrors}
/>
```

### 5. RequestTypeSelector

Card-based selector for choosing request type (Infrastructure, Electricity/Water, Security, IT/Internet).

**Example:**
```tsx
import { RequestTypeSelector } from '@/features/services';

<RequestTypeSelector
  value={requestType}
  onChange={setRequestType}
  error={errors.request_type}
/>
```

### 6. StatusProgressBar

Visual progress indicator for request status (Submitted → In Progress → Resolved → Closed).

**Example:**
```tsx
import { StatusProgressBar } from '@/features/services';

// In table (compact)
<StatusProgressBar status="in_progress" showLabel={false} />

// In detail view (with labels)
<StatusProgressBar status="resolved" showLabel={true} />
```

## Hooks

### useServiceRequestForm

Manages form state and validation for service requests.

**Returns:**
- `formData: ServiceRequestFormData` - Current form data
- `formErrors: Partial<Record<...>>` - Validation errors
- `validateForm: () => boolean` - Validates form and returns true if valid
- `resetForm: () => void` - Resets form to initial state
- `updateFormData: (data) => void` - Updates form data
- `setFormDataFromRequest: (request) => void` - Populates form from existing request
- `setFormData: (data) => void` - Sets form data directly
- `setFormErrors: (errors) => void` - Sets form errors directly

**Example:**
```tsx
import { useServiceRequestForm } from '@/features/services';

const {
  formData,
  formErrors,
  validateForm,
  resetForm,
  updateFormData,
  setFormDataFromRequest
} = useServiceRequestForm();

// For create
const handleCreate = () => {
  if (!validateForm()) return;
  // Create logic...
  resetForm();
};

// For edit
const openEditDialog = (request) => {
  setFormDataFromRequest(request);
  setIsEditOpen(true);
};
```

## Utilities

### generateRequestTitle

Generates a title for a service request.

```tsx
import { generateRequestTitle } from '@/features/services';

const title = generateRequestTitle('infrastructure', t);
// Returns: "Infrastructure - #123456789"
```

### getPriorityColor

Gets the badge color for a priority level.

```tsx
import { getPriorityColor } from '@/features/services';

const color = getPriorityColor('urgent');
// Returns: 'destructive'
```

### getStatusProgress

Calculates progress percentage for a status.

```tsx
import { getStatusProgress } from '@/features/services';

const progress = getStatusProgress('in_progress');
// Returns: 50
```

### Other Utilities

- `isFinalStatus(status)` - Check if status is final (closed)
- `getNextStatus(status)` - Get next status in workflow
- `validateImageFile(file, maxSize)` - Validate image file
- `fileToBase64(file)` - Convert file to base64

## Complete Example

See `/src/components/pages/service-request-page-refactored.tsx` for a complete example of using all these components together.

**Key differences from original:**
- ✅ Form logic extracted to `useServiceRequestForm` hook
- ✅ Dialogs extracted to reusable components
- ✅ Utilities centralized in `service-helpers`
- ✅ ~200 lines of code removed from page component
- ✅ Better separation of concerns
- ✅ More testable and maintainable

## Migration Guide

To migrate from the old page to the new refactored version:

1. Import the hook and components:
```tsx
import {
  StatusProgressBar,
  CreateServiceRequestDialog,
  EditServiceRequestDialog,
  DeleteServiceRequestDialog,
  useServiceRequestForm,
  generateRequestTitle
} from '@/features/services';
```

2. Replace state with hook:
```tsx
// Old
const [formData, setFormData] = useState<ServiceRequestFormData>({...});
const [formErrors, setFormErrors] = useState({});
const validateForm = () => {...};

// New
const {
  formData,
  formErrors,
  validateForm,
  resetForm,
  updateFormData,
  setFormDataFromRequest
} = useServiceRequestForm();
```

3. Replace dialog JSX with components:
```tsx
// Old: 100+ lines of Dialog JSX

// New: 6 lines
<CreateServiceRequestDialog
  open={isCreateDialogOpen}
  onOpenChange={setIsCreateDialogOpen}
  formData={formData}
  formErrors={formErrors}
  onFormDataChange={updateFormData}
  onSubmit={handleCreateRequest}
/>
```

4. Update handlers to use utility functions:
```tsx
// Old
const title = `${typeLabel} - #${timestamp}`;

// New
const title = generateRequestTitle(formData.request_type, t);
```
