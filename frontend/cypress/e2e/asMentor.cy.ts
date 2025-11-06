import { getMeAsMentorMultipleSchools } from '../fixtures/getMe';
import { getAllPeriods, getCurrentPeriod } from '../fixtures/getPeriod';
import { getGroupsAsMentor } from '../fixtures/getGroups';
import { getClassAsMentor } from '../fixtures/getClass';
import { getPupilsBySubjectAsMentor, getSetPupilForecast } from '../fixtures/getPupils';

describe('Education forecast as Mentor', () => {
  beforeEach(() => {
    cy.viewport('macbook-16');

    cy.intercept('GET', '**/api/me', getMeAsMentorMultipleSchools());
    cy.intercept('GET', '**/currentperiod/GY', getCurrentPeriod());
    cy.intercept('GET', '**/allperiods/GY', getAllPeriods());
    cy.intercept('GET', '**/mygroups/**', getGroupsAsMentor());

    cy.visit('http://localhost:3000');
    cy.get('[data-cy="page-title"]').should('exist').contains('Mina ämnen/grupper');
  });

  it('displays subjects and groups correctly', () => {
    cy.get('[data-cy="page-title"]').should('exist').should('include.text', 'Mina ämnen/grupper');

    cy.get('[data-cy="subjects-table"]');
    const headerRow = cy.get('[data-cy="subjects-table-header"] .sk-table-th').first();
    headerRow.get('th').eq(0).find('span').first().should('have.text', 'Grupp');
    headerRow.get('th').eq(1).find('span').first().should('have.text', 'Antal elever');
  });

  it('can set forecast for pupil of subject', () => {
    cy.intercept('GET', '**/pupilsbygroup/**', getPupilsBySubjectAsMentor());
    cy.intercept('POST', '**/setforecast', getSetPupilForecast());

    cy.get('[data-cy="subjects-table"]').should('exist');
    const rowA = cy.get('[data-cy="subjects-table-row-0"]');
    rowA.find('[data-cy="group-link-a-a-a-a-a"]').should('have.text', 'A1').click();

    cy.get('[data-cy="single-subject-table"]').should('exist');
    cy.get('[data-cy="clear-all-button"]').should('not.exist');

    cy.intercept('GET', '**/pupilsbygroup/**', getSetPupilForecast()).as('getSetPupilForecast');
    const row = cy.get('[data-cy="single-subject-table-row-0"]');
    row.find('[data-cy="single-subject-pupil"]').should('have.text', 'Elev Elevsson');
    cy.get('[data-cy="radio-button-achieved"]').should('exist');
    cy.get('[data-cy="radio-button-noticed"]').should('exist');
    cy.get('[data-cy="radio-button-not-achieved"]').should('exist').check({ force: true });
    cy.wait('@getSetPupilForecast');
    cy.get('[data-cy="clear-all-button"]').should('exist');
  });

  it('displays mentor class table correctly', () => {
    cy.intercept('GET', '**/mentorclass/**', getClassAsMentor());

    cy.get('[data-cy="navigation-bar"]').should('exist').contains('Klasser').click({ multiple: true });
    cy.get('[data-cy="popup-menu-class-item-0-link"]').contains('A1').should('exist').click({ multiple: true });

    cy.get('[data-cy="mentor-class-table"]').should('exist');

    const headerRow = cy.get('[data-cy="mentor-class-table"] .sk-table-th').first();
    headerRow.get('th').eq(0).find('span').first().should('have.text', 'Namn');
    headerRow.get('th').eq(1).find('span').first().should('have.text', 'AAA');
    headerRow.get('th').eq(2).find('span').first().should('have.text', 'BBB');
    headerRow.get('th').eq(3).find('span').first().should('have.text', 'CCC');

    cy.get('[data-cy="pupil-0-name"]').should('exist').contains('Elev Elevsson');
    cy.get('[data-cy="pupil-0-presence"]').should('exist').contains('Närvaro: 100%');
    cy.get('[data-cy="pupil-1-name"]').should('exist').contains('Eleven Elevensson');
    cy.get('[data-cy="pupil-1-presence"]').should('exist').contains('Närvaro: 50%');
  });
});
