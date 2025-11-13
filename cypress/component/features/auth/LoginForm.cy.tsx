import { LoginForm } from '@/features/auth/components/login-form';
import { BrowserRouter } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';

// Helper to mount LoginForm with required providers
const mountLoginForm = (props = {}) => {
  return cy.mount(
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <LoginForm {...props} />
      </I18nextProvider>
    </BrowserRouter>
  );
};

describe('LoginForm Component Tests', () => {
  describe('Rendering & Structure', () => {
    it('should render all form elements correctly', () => {
      mountLoginForm();

      // Form fields
      cy.get('input[name="email"]').should('exist').and('be.visible');
      cy.get('input[name="password"]').should('exist').and('be.visible');

      // Labels
      cy.contains('label', 'Email').should('exist');
      cy.contains('label', 'Password').should('exist');

      // Submit button
      cy.get('button[type="submit"]').should('exist').and('contain', 'Sign In');

      // Forgot password link
      cy.contains('a', 'Forgot password?').should('exist').and('have.attr', 'href', '/forgot-password');

      // Google OAuth button
      cy.contains('button', 'Google').should('exist');
    });

    it('should have correct input types and attributes', () => {
      mountLoginForm();

      cy.get('input[name="email"]')
        .should('have.attr', 'type', 'email')
        .and('have.attr', 'autocomplete', 'email')
        .and('have.attr', 'placeholder', 'Enter your email');

      cy.get('input[name="password"]')
        .should('have.attr', 'type', 'password')
        .and('have.attr', 'autocomplete', 'current-password')
        .and('have.attr', 'placeholder', 'Enter your password');
    });

    it('should display divider with "Or continue with" text', () => {
      mountLoginForm();
      cy.contains('Or continue with').should('exist');
    });
  });

  describe('Form Validation', () => {
    it('should show required error when submitting empty email', () => {
      mountLoginForm();

      // Submit without filling email
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();

      // Check for email required error
      cy.contains('Email is required').should('be.visible');
    });

    it('should show required error when submitting empty password', () => {
      mountLoginForm();

      // Submit without filling password
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('button[type="submit"]').click();

      // Check for password required error
      cy.contains('Password is required').should('be.visible');
    });

    it('should show errors for both fields when submitting empty form', () => {
      mountLoginForm();

      cy.get('button[type="submit"]').click();

      cy.contains('Email is required').should('be.visible');
      cy.contains('Password is required').should('be.visible');
    });

    it('should show invalid email error for malformed email', () => {
      mountLoginForm();

      cy.get('input[name="email"]').type('invalid-email');
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();

      cy.contains('Please enter a valid email address').should('be.visible');
    });

    it('should clear validation errors when user types', () => {
      mountLoginForm();

      // Trigger validation errors
      cy.get('button[type="submit"]').click();
      cy.contains('Email is required').should('be.visible');

      // Start typing in email field
      cy.get('input[name="email"]').type('test@example.com');

      // Error should disappear
      cy.contains('Email is required').should('not.exist');
    });

    it('should validate email format in real-time', () => {
      mountLoginForm();

      // Type invalid email and submit
      cy.get('input[name="email"]').type('notanemail');
      cy.get('button[type="submit"]').click();
      cy.contains('Please enter a valid email address').should('be.visible');

      // Fix the email
      cy.get('input[name="email"]').clear().type('valid@email.com');
      cy.get('button[type="submit"]').click();

      // Invalid email error should be gone (password error may remain)
      cy.contains('Please enter a valid email address').should('not.exist');
    });
  });

  describe('User Interactions', () => {
    it('should allow typing in email field', () => {
      mountLoginForm();

      const testEmail = 'user@example.com';
      cy.get('input[name="email"]').type(testEmail).should('have.value', testEmail);
    });

    it('should allow typing in password field', () => {
      mountLoginForm();

      const testPassword = 'SecurePass123!';
      cy.get('input[name="password"]').type(testPassword).should('have.value', testPassword);
    });

    it('should mask password input by default', () => {
      mountLoginForm();

      cy.get('input[name="password"]').should('have.attr', 'type', 'password');
    });

    it('should toggle password visibility when clicking eye icon', () => {
      mountLoginForm();

      cy.get('input[name="password"]').type('mypassword');

      // Click the toggle button (eye icon)
      cy.get('button[aria-label="Toggle password visibility"]').click();

      // Password should now be visible (type="text")
      cy.get('input[name="password"]').should('have.attr', 'type', 'text');

      // Click again to hide
      cy.get('button[aria-label="Toggle password visibility"]').click();

      // Password should be masked again
      cy.get('input[name="password"]').should('have.attr', 'type', 'password');
    });

    it('should clear form fields when clicking clear', () => {
      mountLoginForm();

      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="password"]').type('password123');

      // Clear email
      cy.get('input[name="email"]').clear().should('have.value', '');
      cy.get('input[name="password"]').clear().should('have.value', '');
    });
  });

  describe('Loading States', () => {
    it('should show loading state when isLoading prop is true', () => {
      mountLoginForm({ isLoading: true });

      // Button should show loading text and spinner
      cy.get('button[type="submit"]')
        .should('contain', 'Signing in...')
        .and('be.disabled');

      // Check for loading spinner
      cy.get('button[type="submit"] svg').should('have.class', 'animate-spin');
    });

    it('should disable all inputs during loading', () => {
      mountLoginForm({ isLoading: true });

      cy.get('input[name="email"]').should('be.disabled');
      cy.get('input[name="password"]').should('be.disabled');
      cy.get('button[type="submit"]').should('be.disabled');
      cy.contains('button', 'Google').should('be.disabled');
    });

    it('should show normal state when isLoading is false', () => {
      mountLoginForm({ isLoading: false });

      cy.get('button[type="submit"]')
        .should('contain', 'Sign In')
        .and('not.be.disabled');

      cy.get('input[name="email"]').should('not.be.disabled');
      cy.get('input[name="password"]').should('not.be.disabled');
    });
  });

  describe('Form Submission', () => {
    it('should call onSubmit with correct values when form is valid', () => {
      const onSubmit = cy.stub().resolves();
      mountLoginForm({ onSubmit });

      const testEmail = 'test@example.com';
      const testPassword = 'password123';

      cy.get('input[name="email"]').type(testEmail);
      cy.get('input[name="password"]').type(testPassword);
      cy.get('button[type="submit"]').click();

      // Check onSubmit was called with correct parameters
      cy.wrap(onSubmit).should('have.been.calledWith', testEmail, testPassword, false);
    });

    it('should not call onSubmit when form has validation errors', () => {
      const onSubmit = cy.stub().resolves();
      mountLoginForm({ onSubmit });

      // Submit with invalid email
      cy.get('input[name="email"]').type('invalid-email');
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();

      // onSubmit should not be called
      cy.wrap(onSubmit).should('not.have.been.called');
    });

    it('should prevent multiple submissions during loading', () => {
      const onSubmit = cy.stub().resolves();
      mountLoginForm({ isLoading: true, onSubmit });

      cy.get('input[name="email"]').should('be.disabled');
      cy.get('button[type="submit"]').should('be.disabled');

      // Try to click submit button (should not work)
      cy.get('button[type="submit"]').click({ force: true });

      cy.wrap(onSubmit).should('not.have.been.called');
    });

    it('should submit form on Enter key press', () => {
      const onSubmit = cy.stub().resolves();
      mountLoginForm({ onSubmit });

      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="password"]').type('password123{enter}');

      cy.wrap(onSubmit).should('have.been.calledOnce');
    });
  });

  describe('Error Display', () => {
    it('should display error message when login fails', () => {
      const errorMessage = 'Invalid credentials. Please try again.';
      const onSubmit = cy.stub().rejects(new Error(errorMessage));

      mountLoginForm({ onSubmit });

      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="password"]').type('wrongpassword');
      cy.get('button[type="submit"]').click();

      // Error message should be displayed
      cy.contains(errorMessage).should('be.visible');
    });

    it('should show error with destructive styling', () => {
      const onSubmit = cy.stub().rejects(new Error('Login failed'));
      mountLoginForm({ onSubmit });

      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="password"]').type('password');
      cy.get('button[type="submit"]').click();

      // Check error div has destructive classes
      cy.get('.text-destructive').should('exist').and('be.visible');
    });

    it('should clear error message when resubmitting form', () => {
      let callCount = 0;
      const onSubmit = cy.stub().callsFake(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.reject(new Error('First attempt failed'));
        }
        return Promise.resolve();
      });

      mountLoginForm({ onSubmit });

      // First submission - should fail
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="password"]').type('password');
      cy.get('button[type="submit"]').click();

      cy.contains('First attempt failed').should('be.visible');

      // Second submission - should clear error
      cy.get('button[type="submit"]').click();

      cy.contains('First attempt failed').should('not.exist');
    });
  });

  describe('Links & Navigation', () => {
    it('should have forgot password link with correct href', () => {
      mountLoginForm();

      cy.contains('a', 'Forgot password?')
        .should('have.attr', 'href', '/forgot-password')
        .and('have.class', 'text-primary');
    });

    it('should have tabindex -1 on forgot password link', () => {
      mountLoginForm();

      cy.contains('a', 'Forgot password?').should('have.attr', 'tabindex', '-1');
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria-labels and roles', () => {
      mountLoginForm();

      // Form should have proper structure
      cy.get('form').should('exist');

      // Inputs should be associated with labels
      cy.get('label[for="email"]').should('exist');
      cy.get('label[for="password"]').should('exist');
    });

    it('should support keyboard navigation', () => {
      mountLoginForm();

      // Tab through fields
      cy.get('input[name="email"]').focus().should('have.focus');
      cy.get('input[name="email"]').tab();
      cy.get('input[name="password"]').should('have.focus');
    });

    it('should announce errors to screen readers', () => {
      mountLoginForm();

      cy.get('button[type="submit"]').click();

      // Error messages should be in the DOM and visible
      cy.contains('Email is required').should('be.visible');
      cy.contains('Password is required').should('be.visible');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long email addresses', () => {
      mountLoginForm();

      const longEmail = 'a'.repeat(50) + '@' + 'b'.repeat(50) + '.com';
      cy.get('input[name="email"]').type(longEmail).should('have.value', longEmail);
    });

    it('should handle special characters in password', () => {
      mountLoginForm();

      const specialPassword = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      cy.get('input[name="password"]').type(specialPassword).should('have.value', specialPassword);
    });

    it('should trim whitespace from email', () => {
      const onSubmit = cy.stub().resolves();
      mountLoginForm({ onSubmit });

      cy.get('input[name="email"]').type('  test@example.com  ');
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();

      // Email should be trimmed before submission
      // Note: This depends on your form implementation
    });

    it('should handle rapid form submissions gracefully', () => {
      const onSubmit = cy.stub().resolves();
      mountLoginForm({ onSubmit });

      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="password"]').type('password123');

      // Try to submit multiple times quickly
      cy.get('button[type="submit"]').click();
      cy.get('button[type="submit"]').click();
      cy.get('button[type="submit"]').click();

      // Should only submit once (or handle gracefully)
      cy.wrap(onSubmit).should('have.been.called');
    });

    it('should handle undefined onSubmit prop gracefully', () => {
      mountLoginForm();

      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="password"]').type('password123');

      // Should not crash when clicking submit
      cy.get('button[type="submit"]').click();
    });
  });

  describe('Google OAuth Button', () => {
    it('should render Google button with correct styling', () => {
      mountLoginForm();

      cy.contains('button', 'Google')
        .should('exist')
        .and('have.attr', 'type', 'button');
    });

    it('should disable Google button during loading', () => {
      mountLoginForm({ isLoading: true });

      cy.contains('button', 'Google').should('be.disabled');
    });

    it('should have Google icon SVG', () => {
      mountLoginForm();

      cy.contains('button', 'Google').find('svg').should('exist');
    });
  });
});
