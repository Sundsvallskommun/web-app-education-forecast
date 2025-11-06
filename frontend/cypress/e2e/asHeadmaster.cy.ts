import { getMeAsHeadmasterMultipleSchools } from '../fixtures/getMe';
import { getAllPeriods, getCurrentPeriod } from '../fixtures/getPeriod';
import { getClassAsHeadmaster, getSearchedClassAsHeadmaster } from '../fixtures/getClass';
import { getGroupsAsHeadmaster } from '../fixtures/getGroups';
import { getPupilsAsHeadmaster } from '../fixtures/getPupils';

describe('Education forecast as Headmaster', () => {
  beforeEach(() => {
    cy.viewport('macbook-16');

    cy.intercept('GET', '**/api/me', getMeAsHeadmasterMultipleSchools());
    cy.intercept('GET', '**/currentperiod/GR', getCurrentPeriod());
    cy.intercept('GET', '**/allperiods/GR', getAllPeriods());
    cy.intercept(
      'GET',
      '**/mygroups/*?OrderBy=GroupName&OrderDirection=ASC&periodId=*&groupType=K*&PageSize=10',
      getClassAsHeadmaster()
    );

    cy.visit('http://localhost:3000');
    cy.get('[data-cy="page-title"]').should('exist').contains('Klasser');
  });

  it('displays classes table correctly', () => {
    cy.get('[data-cy="classes-table"]').should('exist');

    const headerRow = cy.get('[data-cy="classes-table-header"] .sk-table-th').first();
    headerRow.get('th').eq(0).find('span').first().should('have.text', 'Klass');
    headerRow.get('th').eq(1).find('span').first().should('have.text', 'Mentor');
    headerRow.get('th').eq(2).find('span').first().should('have.text', 'Antal elever');
    headerRow.get('th').eq(3).find('span').first().should('have.text', 'Närvaro');
    headerRow.get('th').eq(4).find('span').first().should('have.text', 'Når målen');
    headerRow.get('th').eq(5).find('span').first().should('have.text', 'Uppmärksammad');
    headerRow.get('th').eq(6).find('span').first().should('have.text', 'Når ej målen');
    headerRow.get('th').eq(7).find('span').first().should('have.text', 'Inte ifyllda');

    cy.get('[data-cy="class-link-a-a-a-a-a"]').should('exist').should('have.text', 'Klass 1');
    cy.get('[data-cy="class-link-b-b-b-b-b"]').should('exist').should('have.text', 'Klass 2');

    cy.get('[data-cy="approved-pupils-badge-a-a-a-a-a"]').should('exist').should('have.text', '3');
    cy.get('[data-cy="approved-pupils-badge-b-b-b-b-b"]').should('exist').should('have.text', '1');
  });

  it('can search for classes', () => {
    cy.intercept(
      'GET',
      '**/mygroups/*?OrderBy=GroupName&OrderDirection=ASC&periodId=*&groupType=K&searchFilter=1&PageSize=10',
      getSearchedClassAsHeadmaster()
    );

    cy.get('[data-cy="search-field"]').should('exist').type('1');
    cy.get('[data-cy="class-link-a-a-a-a-a"]').should('exist').should('have.text', 'Klass 1');
    cy.get('[data-cy="class-link-b-b-b-b-b"]').should('not.exist');
  });

  it('displays subjects and groups correctly', () => {
    cy.intercept(
      'GET',
      '**/mygroups/a-a-a-a-a?OrderBy=GroupName&OrderDirection=ASC&periodId=1&groupType=G*&PageSize=10',
      getGroupsAsHeadmaster()
    );

    cy.get('[data-cy="navigation-bar"]').should('exist').contains('Ämnen/grupper').click();

    cy.get('[data-cy="popup-1-link-item-a-a-a-a-a"]')
      .should('include.text', 'Sundsvalls Grundskola 1')
      .click({ multiple: true, force: true });

    cy.get('[data-cy="page-title"]').should('exist').should('include.text', 'Ämnen/grupper');

    cy.get('[data-cy="subjects-table"]').should('exist');
    const headerRow = cy.get('[data-cy="subjects-table-header"] .sk-table-th').first();
    headerRow.get('th').eq(0).find('span').first().should('have.text', 'Grupp');

    const rowA = cy.get('[data-cy="subjects-table-row-0"]');
    rowA.find('[data-cy="group-link-a-a-a-a-a"]').should('have.text', '1');
    rowA.get('td').eq(0).find('span').first().should('have.text', 'Lärare Läraresson (LLä)');
    rowA.get('td').eq(1).find('span').first().should('have.text', '10');
    rowA.get('td').eq(2).find('span').first().should('have.text', '98%');
    rowA.get('td').eq(3).find('span').first().should('have.text', '1');
    rowA.get('td').eq(4).find('span').first().should('have.text', '2');
    rowA.get('td').eq(5).find('span').first().should('have.text', '3');
  });

  it('displays pupils correctly', () => {
    cy.intercept(
      'GET',
      '**/a-a-a-a-a/allpupils?periodId=1*&PageSize=10&OrderBy=Givenname&OrderDirection=ASC',
      getPupilsAsHeadmaster()
    ).as('getPupils');

    cy.get('[data-cy="navigation-bar"]').should('exist').contains('Elever').click();
    cy.get('[data-cy="popup-2-link-item-a-a-a-a-a"]')
      .should('include.text', 'Sundsvalls Grundskola 1')
      .click({ multiple: true, force: true });

    cy.wait('@getPupils');
    cy.get('[data-cy="page-title"]').should('exist').should('include.text', 'Elever');

    cy.get('[data-cy="pupils-table"]').should('exist');
    const headerRow = cy.get('[data-cy="pupils-table-header"] .sk-table-th').first();
    headerRow.get('th').eq(0).find('span').first().should('have.text', 'Namn');
    headerRow.get('th').eq(1).find('span').first().should('have.text', 'Klass');
  });
});
