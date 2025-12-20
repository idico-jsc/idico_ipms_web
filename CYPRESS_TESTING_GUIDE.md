# Cypress Testing Guide

Comprehensive guide for running and writing Cypress tests for the authentication system.

## Table of Contents

- [Overview](#overview)
- [Setup](#setup)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Custom Commands](#custom-commands)
- [Writing Tests](#writing-tests)
- [Best Practices](#best-practices)
- [Debugging](#debugging)
- [CI/CD Integration](#cicd-integration)

## Overview

This project uses Cypress for both **component testing** and **end-to-end (E2E) testing**.

### Test Coverage

#### Component Tests (`cypress/component/`)
- LoginForm component rendering
- Form validation (required fields, email format)
- User interactions (typing, toggling password visibility)
- Loading states
- Error display
- Accessibility features
- Edge cases

#### E2E Tests (`cypress/e2e/`)
- Complete login flow
- Protected route access
- Token persistence
- Auto-logout on 401/403
- Logout flow
- Error handling (network errors, invalid credentials)
- Mobile responsiveness
- Performance

## Setup

### Prerequisites

```bash
# Install dependencies
npm install
```

### Environment Setup

Ensure your dev server is configured in `cypress.config.ts`:

```typescript
export default defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_DOMAIN_TESTING || 'http://localhost:3000',
  },
});
```

## Running Tests

### Interactive Mode (Recommended for Development)

```bash
# Open Cypress Test Runner for E2E tests
npm run cypress:open

# Or specifically for component tests
npm run cypress:component
```

### Headless Mode (CI/CD)

```bash
# Run all E2E tests in headless mode
npm run cypress:run

# Run all component tests
npm run cypress:component:run

# Run specific test file
npx cypress run --spec "cypress/e2e/auth.cy.ts"

# Run tests in specific browser
npx cypress run --browser chrome
```

### Watch Mode (Development)

```bash
# Start dev server
npm run dev

# In another terminal, open Cypress
npm run cypress:open
```

## Test Structure

### Component Tests

Located in `cypress/component/features/auth/LoginForm.cy.tsx`

```typescript
describe('LoginForm Component Tests', () => {
  describe('Rendering & Structure', () => {
    it('should render all form elements correctly', () => {
      // Test implementation
    });
  });

  describe('Form Validation', () => {
    // Validation tests
  });

  // More test suites...
});
```

### E2E Tests

Located in `cypress/e2e/auth.cy.ts`

```typescript
describe('Authentication E2E Tests', () => {
  const VALID_EMAIL = 'Administrator';
  const VALID_PASSWORD = 'admin';

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  describe('Login Page', () => {
    // Login page tests
  });

  describe('Successful Login Flow', () => {
    // Happy path tests
  });

  // More test suites...
});
```

## Custom Commands

We provide custom Cypress commands for common authentication tasks.

### Available Commands

#### `cy.login(email, password)`
Login via UI (fills form and clicks submit)

```typescript
cy.login('test@example.com', 'password123');
```

#### `cy.loginViaApi(email, password)`
Login via API (faster, for test setup)

```typescript
cy.loginViaApi('test@example.com', 'password123');
cy.visit('/dashboard'); // Already authenticated
```

#### `cy.logout()`
Click logout button

```typescript
cy.logout();
cy.url().should('include', '/login');
```

#### `cy.clearAuth()`
Clear authentication without UI interaction

```typescript
cy.clearAuth();
```

#### `cy.isAuthenticated()`
Check if user is authenticated

```typescript
cy.isAuthenticated().should('be.true');
```

#### `cy.fillLoginForm(email, password)`
Fill login form without submitting

```typescript
cy.fillLoginForm('test@example.com', 'password123');
cy.submitForm();
```

#### `cy.shouldHaveValidationError(message)`
Assert validation error is visible

```typescript
cy.get('button[type="submit"]').click();
cy.shouldHaveValidationError('Email is required');
```

#### `cy.shouldHaveApiError(message)`
Assert API error is displayed

```typescript
cy.shouldHaveApiError('Invalid credentials');
```

#### `cy.mockLoginSuccess()`
Mock successful login API call

```typescript
cy.mockLoginSuccess();
cy.fillLoginForm('test@example.com', 'password123');
cy.submitForm();
cy.url().should('not.include', '/login');
```

#### `cy.mockLoginFailure(message)`
Mock failed login API call

```typescript
cy.mockLoginFailure('Invalid credentials');
cy.fillLoginForm('wrong@example.com', 'wrongpass');
cy.submitForm();
cy.shouldHaveApiError('Invalid credentials');
```

### Full Command Reference

See `cypress/support/commands.ts` for all available custom commands.

## Writing Tests

### Component Test Example

```typescript
import { LoginForm } from '@/features/auth/components/login-form';

const mountLoginForm = (props = {}) => {
  return cy.mount(
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <LoginForm {...props} />
      </I18nextProvider>
    </BrowserRouter>
  );
};

it('should validate email format', () => {
  mountLoginForm();

  cy.get('input[name="email"]').type('invalid-email');
  cy.get('input[name="password"]').type('password123');
  cy.get('button[type="submit"]').click();

  cy.shouldHaveValidationError('Please enter a valid email address');
});
```

### E2E Test Example

```typescript
it('should successfully login with valid credentials', () => {
  cy.visit('/login');

  cy.intercept('POST', '**/api/method/login').as('loginRequest');

  cy.fillLoginForm('Administrator', 'admin');
  cy.submitForm();

  cy.wait('@loginRequest');
  cy.url().should('not.include', '/login');
  cy.getCookie('token').should('exist');
});
```

### Testing Loading States

```typescript
it('should show loading state during login', () => {
  cy.visit('/login');

  // Intercept and delay response
  cy.intercept('POST', '**/api/method/login', (req) => {
    req.reply((res) => {
      res.delay = 1000;
      res.send();
    });
  }).as('loginRequest');

  cy.fillLoginForm('test@example.com', 'password123');
  cy.submitForm();

  // Assert loading state
  cy.get('button[type="submit"]')
    .should('be.disabled')
    .and('contain', 'Signing in...');

  cy.get('button[type="submit"] svg.animate-spin').should('exist');

  cy.wait('@loginRequest');
});
```

### Testing Error Handling

```typescript
it('should handle network errors gracefully', () => {
  cy.visit('/login');

  cy.intercept('POST', '**/api/method/login', {
    forceNetworkError: true,
  });

  cy.fillLoginForm('test@example.com', 'password123');
  cy.submitForm();

  cy.get('.text-destructive').should('exist');
});
```

## Best Practices

### 1. Clear State Between Tests

```typescript
beforeEach(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
});
```

### 2. Use Custom Commands

```typescript
// ❌ Bad - Repetitive
cy.get('input[name="email"]').type('test@example.com');
cy.get('input[name="password"]').type('password123');
cy.get('button[type="submit"]').click();

// ✅ Good - Use custom command
cy.login('test@example.com', 'password123');
```

### 3. Intercept API Calls

```typescript
// Always alias intercepts for better debugging
cy.intercept('POST', '**/api/method/login').as('loginRequest');
cy.wait('@loginRequest');
```

### 4. Use Data Attributes for Selectors

```typescript
// ❌ Fragile - based on implementation
cy.get('.login-form button').click();

// ✅ Better - based on structure
cy.get('button[type="submit"]').click();

// ✅ Best - data attributes (if available)
cy.get('[data-testid="login-button"]').click();
```

### 5. Assertions

```typescript
// Chain assertions
cy.get('button[type="submit"]')
  .should('be.visible')
  .and('not.be.disabled')
  .and('contain', 'Sign In');

// Use specific assertions
cy.url().should('include', '/login');
cy.getCookie('token').should('exist');
```

### 6. Organize Tests with describe()

```typescript
describe('Feature', () => {
  describe('Sub-feature', () => {
    it('should do specific thing', () => {
      // Test implementation
    });
  });
});
```

### 7. Test Independence

Each test should be independent and not rely on other tests:

```typescript
// ❌ Bad - Tests depend on each other
it('logs in', () => { /* login */ });
it('shows profile', () => { /* assumes logged in */ });

// ✅ Good - Each test is independent
it('logs in', () => { /* login */ });
it('shows profile after login', () => {
  cy.loginViaApi('test@example.com', 'password123');
  // test profile
});
```

## Debugging

### Visual Debugging

```typescript
// Take screenshot
cy.screenshot('login-error');

// Pause execution
cy.pause();

// Debug current subject
cy.get('input[name="email"]').debug();
```

### Console Logging

```typescript
cy.get('input[name="email"]').then(($el) => {
  console.log('Email input:', $el);
});
```

### Time Travel Debugging

When running in interactive mode, you can:
1. Hover over commands in the Command Log
2. See snapshots of the application state
3. Click to pin and inspect the DOM

### Network Debugging

```typescript
// Log all XHR requests
cy.intercept('**', (req) => {
  console.log('Request:', req.method, req.url);
});
```

### Failed Test Screenshots

Cypress automatically takes screenshots of failed tests in `cypress/screenshots/`

### Video Recording

Videos of test runs are saved in `cypress/videos/` (configurable)

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Cypress Tests

on: [push, pull_request]

jobs:
  cypress:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run Cypress tests
        uses: cypress-io/github-action@v5
        with:
          build: npm run build
          start: npm run preview
          wait-on: 'http://localhost:3000'
          browser: chrome

      - name: Upload screenshots
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: cypress-screenshots
          path: cypress/screenshots

      - name: Upload videos
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: cypress-videos
          path: cypress/videos
```

### Running Tests Locally (Pre-commit)

```bash
# Run tests before committing
npm run cypress:run

# Or add to husky pre-commit hook
```

## Test Coverage

### Current Coverage

#### Component Tests
- ✅ Form rendering
- ✅ Input validation
- ✅ User interactions
- ✅ Loading states
- ✅ Error display
- ✅ Password visibility toggle
- ✅ Accessibility
- ✅ Edge cases

#### E2E Tests
- ✅ Login flow (success/failure)
- ✅ Protected routes
- ✅ Token persistence
- ✅ Auto-logout
- ✅ Logout flow
- ✅ Network errors
- ✅ Mobile responsiveness
- ✅ Performance

### Coverage Reports

To generate coverage reports:

```bash
# Install coverage plugin
npm install -D @cypress/code-coverage

# Run tests with coverage
npm run cypress:run
```

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

#### Tests Timing Out
```bash
# Increase timeout in cypress.config.ts
export default defineConfig({
  e2e: {
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
  },
});
```

#### Module Not Found
```bash
# Clear Cypress cache
npx cypress cache clear
npm install
```

## Resources

- [Cypress Documentation](https://docs.cypress.io/)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Cypress Testing Library](https://testing-library.com/docs/cypress-testing-library/intro/)

## Support

For issues or questions:
1. Check the [Cypress Troubleshooting Guide](https://docs.cypress.io/guides/references/troubleshooting)
2. Review existing tests for examples
3. Create an issue in the project repository
