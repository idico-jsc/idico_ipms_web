describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the home page', () => {
    cy.url().should('include', '/');
  });

  it('should display version number', () => {
    cy.contains(/v\d+\.\d+\.\d+/).should('be.visible');
  });

  it('should be responsive', () => {
    // Test mobile viewport
    cy.viewport('iphone-x');
    cy.visit('/');
    cy.get('body').should('be.visible');

    // Test tablet viewport
    cy.viewport('ipad-2');
    cy.visit('/');
    cy.get('body').should('be.visible');

    // Test desktop viewport
    cy.viewport(1920, 1080);
    cy.visit('/');
    cy.get('body').should('be.visible');
  });
});
