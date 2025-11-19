import { getMeAsTeacher } from '../fixtures/getMe';
import { getAllPeriods, getCurrentPeriod } from '../fixtures/getPeriod';
import { getGroupAsTeacher } from '../fixtures/getGroups';

describe('Education forecast as Teacher', () => {
  beforeEach(() => {
    cy.viewport('macbook-16');

    cy.intercept('GET', '**/api/me', getMeAsTeacher());
    cy.intercept('GET', '**/currentperiod/GY', getCurrentPeriod());
    cy.intercept('GET', '**/allperiods/GY', getAllPeriods());
    cy.intercept('GET', '**/mygroups/**', getGroupAsTeacher());

    cy.visit('http://localhost:3000');
    cy.get('[data-cy="page-title"]').should('exist').contains('Mina ämnen/grupper');
  });

  it('displays subjects and groups table correctly', () => {
    cy.get('[data-cy="subjects-table"]').should('exist');

    const headerRow = cy.get('[data-cy="subjects-table-header"] .sk-table-th').first();
    headerRow.get('th').eq(0).find('span').first().should('have.text', 'Grupp');
    headerRow.get('th').eq(1).find('span').first().should('have.text', 'Antal elever');
    headerRow.get('th').eq(2).find('span').first().should('have.text', 'Närvaro');
    headerRow.get('th').eq(3).find('span').first().should('have.text', 'Når målen');
    headerRow.get('th').eq(4).find('span').first().should('have.text', 'Uppmärksammad');
    headerRow.get('th').eq(5).find('span').first().should('have.text', 'Når ej målen');
    headerRow.get('th').eq(6).find('span').first().should('have.text', 'Inte ifyllda');
  });
});
