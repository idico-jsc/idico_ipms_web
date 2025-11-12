import { LoginForm } from '../../../../src/features/auth/components/LoginForm';

describe('LoginForm - Auth Feature', () => {
  it('renders login form with email and password inputs', () => {
    cy.mount(<LoginForm />);
    cy.get('input[type="email"]').should('exist');
    cy.get('input[type="password"]').should('exist');
    cy.get('button[type="submit"]').should('contain', 'Sign In');
  });

  it('validates required fields', () => {
    cy.mount(<LoginForm />);
    cy.get('button[type="submit"]').click();
    cy.get('input[type="email"]:invalid').should('exist');
    cy.get('input[type="password"]:invalid').should('exist');
  });

  it('updates email and password values on input', () => {
    cy.mount(<LoginForm />);

    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="email"]').should('have.value', 'test@example.com');

    cy.get('input[type="password"]').type('password123');
    cy.get('input[type="password"]').should('have.value', 'password123');
  });

  it('calls onSubmit with email and password when form is submitted', () => {
    const onSubmit = cy.stub().as('submitHandler');
    cy.mount(<LoginForm onSubmit={onSubmit} />);

    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.get('@submitHandler').should('have.been.calledWith', 'test@example.com', 'password123');
  });

  it('shows loading state when isLoading is true', () => {
    cy.mount(<LoginForm isLoading={true} />);
    cy.get('button[type="submit"]').should('contain', 'Signing in...');
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('shows normal state when isLoading is false', () => {
    cy.mount(<LoginForm isLoading={false} />);
    cy.get('button[type="submit"]').should('contain', 'Sign In');
    cy.get('button[type="submit"]').should('not.be.disabled');
  });

  it('displays correct labels', () => {
    cy.mount(<LoginForm />);
    cy.contains('label', 'Email').should('exist');
    cy.contains('label', 'Password').should('exist');
  });

  it('has proper input types', () => {
    cy.mount(<LoginForm />);
    cy.get('#email').should('have.attr', 'type', 'email');
    cy.get('#password').should('have.attr', 'type', 'password');
  });
});
