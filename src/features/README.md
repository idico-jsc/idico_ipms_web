# Features

Features are self-contained modules that represent specific business functionalities. Each feature uses components from the atomic design structure.

## Structure

Each feature follows this structure:

```
feature-name/
├── components/     # Feature-specific components (use atoms/molecules/organisms)
├── hooks/         # Feature-specific hooks
├── services/      # API calls and business logic
├── types/         # TypeScript types/interfaces
├── utils/         # Helper functions
├── index.ts      # Main export
└── README.md      # Feature documentation
```

## Guidelines

- **Isolation**: Features should be as independent as possible
- **Reuse**: Use atomic components from `@/components`
- **No direct imports**: Features should not import from other features
- **Shared logic**: Put shared logic in global hooks/utils/services

## Examples

- `auth/` - Authentication and authorization
- `dashboard/` - Dashboard views and widgets
- `profile/` - User profile management
