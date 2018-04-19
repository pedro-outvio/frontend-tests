export const login = () => {
  cy.get('input[name="email"]').type(Cypress.env('USER_EMAIL'));
  cy.get('input[name="password"]').type(Cypress.env('USER_PASS'));
  cy.get('button[type="submit"]').click();
};

describe('Login Page', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('URL_TEST'), {
      onBeforeLoad: () => {
        indexedDB.deleteDatabase('localforage');
      }
    });
    cy.viewport('macbook-13');
  });

  it('Should login in the page', () => {
    login();

    cy.get('.Sidenav__BelowLogoText').as('messageWelcome');

    cy.get('@messageWelcome').should('contain', Cypress.env('USER_NAME'));
  });

  it('Should logout in the page', () => {
    login();
    cy
      .get('.LogoutHolder')
      .find('svg')
      .click();

    cy.location('pathname').should('eq', '/login');
  });
});
