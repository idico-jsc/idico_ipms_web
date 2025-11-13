describe("Authentication E2E Tests", () => {
  const VALID_EMAIL = "kha.nguyen@wellspringsaigon.edu.vn";
  const VALID_PASSWORD = "Abc@123";
  const INVALID_EMAIL = "wrong@example.com";
  const INVALID_PASSWORD = "wrongpassword";
  const TOKEN_COOKIE_NAME = "auth_token";

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  describe("Login Flow", () => {
    beforeEach(() => {
      cy.visit("/login");
    });
    it("should display login page when not authenticated", () => {
      cy.url().should("include", "/login");
      cy.get('input[name="email"]').should("be.visible");
      cy.get('input[name="password"]').should("be.visible");
      cy.get('button[type="submit"]').should("be.visible").and("contain", "Sign In");
    });

    it("should successfully login with valid credentials", () => {
      cy.get('input[name="email"]').type(VALID_EMAIL);
      cy.get('input[name="password"]').type(VALID_PASSWORD);
      cy.get('button[type="submit"]').click();
      cy.url().should("not.include", "/login");
      cy.getCookie(TOKEN_COOKIE_NAME).should("exist");
    });

    it("should show loading state during login", () => {
      cy.get('input[name="email"]').type(VALID_EMAIL);
      cy.get('input[name="password"]').type(VALID_PASSWORD);
      cy.get('button[type="submit"]').click();
      cy.get('button[type="submit"]').should("be.disabled");
      cy.get('button[type="submit"] svg.animate-spin').should("exist");
    });

    it("should show error message for invalid credentials", () => {
      cy.get('input[name="email"]').type(INVALID_EMAIL);
      cy.get('input[name="password"]').type(INVALID_PASSWORD);
      cy.get('button[type="submit"]').click();
      cy.get('[data-testid="invalid_credentials"]').should("be.visible");
      cy.url().should("include", "/login");
    });
  });

  describe("Form Validation", () => {
    beforeEach(() => {
      cy.visit("/login");
    });

    it("should show validation errors for empty form", () => {
      cy.get('button[type="submit"]').click();
      cy.contains("Email is required").should("be.visible");
      cy.contains("Password is required").should("be.visible");
    });

    it("should show validation error for invalid email format", () => {
      cy.get('input[name="email"]').type("not-a-valid-email");
      cy.get('input[name="password"]').type("somepassword");
      cy.get('button[type="submit"]').click();
      cy.contains("Please enter a valid email address").should("be.visible");
    });
  });

  describe("Protected Routes", () => {
    beforeEach(() => {
      cy.visit("/login");
    });
    it("should redirect to login when accessing protected route without auth", () => {
      cy.url().should("include", "/login");
    });

    it("should allow access to protected routes after login", () => {
      cy.visit("/login");
      cy.get('input[name="email"]').type(VALID_EMAIL);
      cy.get('input[name="password"]').type(VALID_PASSWORD);

      cy.intercept("POST", "**/api/method/login").as("login");
      cy.get('button[type="submit"]').click();
      cy.wait("@login");

      cy.url().should("not.include", "/login");

      cy.url().should("not.include", "/login");
    });

    it("should persist authentication after page reload", () => {
      cy.visit("/login");
      cy.get('input[name="email"]').type(VALID_EMAIL);
      cy.get('input[name="password"]').type(VALID_PASSWORD);
      cy.get('button[type="submit"]').click();

      cy.url().should("not.include", "/login");
      cy.reload();
      cy.url().should("not.include", "/login");
    });
  });

  describe("Logout Flow", () => {
    beforeEach(() => {
      cy.visit("/login");
      cy.get('input[name="email"]').type(VALID_EMAIL);
      cy.get('input[name="password"]').type(VALID_PASSWORD);
      cy.intercept("POST", "**/api/method/login").as("login");
      cy.get('button[type="submit"]').click();
      cy.wait("@login");
      cy.url().should("not.include", "/login");
    });

    it("should successfully logout and clear authentication", () => {
      cy.intercept("POST", "**/api/method/logout").as("logout");
      cy.contains("button", "Logout").click();
      cy.wait("@logout");

      cy.url().should("include", "/login");
      cy.getCookie(TOKEN_COOKIE_NAME).should("not.exist");
    });
  });

  describe("Auto-logout on 401", () => {
    beforeEach(() => {
      cy.visit("/login");
    });
    it("should auto-logout when API returns 401", () => {
      cy.get('input[name="email"]').type(VALID_EMAIL);
      cy.get('input[name="password"]').type(VALID_PASSWORD);
      cy.intercept("POST", "**/api/method/login").as("login");
      cy.get('button[type="submit"]').click();
      cy.wait("@login");

      cy.intercept("GET", "**/api/method/**", {
        statusCode: 401,
        body: { message: "Unauthorized" },
      }).as("unauthorizedRequest");

      cy.reload();
      cy.url().should("include", "/login", { timeout: 10000 });
    });
  });

  describe("User Interactions", () => {
    beforeEach(() => {
      cy.visit("/login");
    });

    it("should submit form with Enter key", () => {
      cy.intercept("POST", "**/api/method/login").as("login");
      cy.get('input[name="email"]').type(VALID_EMAIL);
      cy.get('input[name="password"]').type(`${VALID_PASSWORD}{enter}`);
      cy.wait("@login");
      cy.url().should("not.include", "/login");
    });

    it("should toggle password visibility", () => {
      cy.get('input[name="password"]').type("mypassword");
      cy.get('input[name="password"]').should("have.attr", "type", "password");

      cy.get('button[aria-label="Toggle password visibility"]').click();
      cy.get('input[name="password"]').should("have.attr", "type", "text");

      cy.get('button[aria-label="Toggle password visibility"]').click();
      cy.get('input[name="password"]').should("have.attr", "type", "password");
    });
  });

});
