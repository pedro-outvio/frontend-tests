import { login } from './login';
import faker from 'faker';

const makeOrder = () => {
  let fakerUser = {
    name: faker.name.findName(),
    phone: faker.phone.phoneNumber(),
    address: faker.address.streetAddress(),
    email: faker.internet.email(),
    postcode: faker.address.zipCode(),
    city: faker.address.city()
  };
  let fakerOrderId = faker.random.number();
  let fakerProduct = {
    name: faker.commerce.productName(),
    quantity: 1,
    price: faker.commerce.price(),
    sku: 10
  };

  cy.get('input[name="data.client.delivery.name"]').type(fakerUser.name);
  cy.get('input[name="data.client.delivery.phone"]').type(fakerUser.phone);
  cy.get('input[name="data.client.delivery.address"]').type(fakerUser.address);
  cy.get('input[name="data.client.delivery.email"]').type(fakerUser.email);
  cy
    .get('input[name="data.client.delivery.postcode"]')
    .type(fakerUser.postcode);

  cy.get('input[name="data.client.delivery.city"]').type(fakerUser.city);

  cy.get('div[name="data.client.delivery.countryCode"').click();

  cy
    .get('span[role="menuitem"]')
    .contains('Spain')
    .click();

  cy.get('div[name="data.shipping.method"]').click();

  cy
    .get('span[role="menuitem"]')
    .first()
    .click();

  cy.get('.OrderEditor__CopyData').click();

  cy.get('div[name="data.payment.status"]').click();

  cy
    .get('span[role="menuitem"]')
    .first()
    .click();

  cy.get('div[name="data.payment.method"]').click();

  cy
    .get('span[role="menuitem"]')
    .first()
    .click();

  cy.get('input[name="data.invoiceNumber"]').type(faker.random.number());

  cy.get('#add-product').click();

  cy.get('input[name="name"]').type(fakerProduct.name);
  cy.get('input[name="quantity"]').type(fakerProduct.quantity);

  cy.get('input[name="price"]').type(1);
  cy.get('input[name="sku"]').type(fakerProduct.sku);

  cy.get('input[name="data.shipping.price"]').type(1);
  cy.get('input[name="data.tax"]').type(16);

  cy.get('input[name="data.id"]').type(fakerOrderId);

  cy.get('#button-create-order').click();

  return fakerUser;
};

describe('Order', () => {
  let fakerUser;

  beforeEach(() => {
    cy.visit(Cypress.env('URL_TEST'), {
      onBeforeLoad: () => {
        indexedDB.deleteDatabase('localforage');
      }
    });
    cy.viewport('macbook-13');

    fakerUser = {
      name: faker.name.findName(),
      phone: faker.phone.phoneNumber(),
      address: faker.address.streetAddress(),
      email: faker.internet.email(),
      postcode: faker.address.zipCode()
    };
  });

  it('should create a order', () => {
    login();

    cy.get('.Sidebar__MenuItem[data-url="/orders"').click();

    cy.get('#actions-orders').click();
    cy.get('#create-order').click();

    let userOrder = makeOrder();

    cy
      .get('.ListItem--selected')
      .find('.ListItem__Title')
      .should('contain', userOrder.email);
  });

  it.only('should check the returns', () => {
    cy.server();
    cy
      .route('**/return?maxPerPage**', {
        status: 500,
        response: { error: true }
      })
      .as('getReturns');

    login();

    cy.get('.Sidebar__MenuItem[data-url="/returns"').click();

    cy.wait('@getReturns');
  });
});
