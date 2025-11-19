import {
  getMeAsHeadmaster,
  getMeAsHeadmasterMultipleSchools,
  getMeAsMentor,
  getMeAsMentorMultipleSchools,
  getMeAsTeacher,
  getMeAsTeacherMultipleSchools,
} from '../fixtures/getMe';
import { getAllPeriods, getCurrentPeriod } from '../fixtures/getPeriod';
import { getGroupAsTeacher, getGroupsAsMentor } from '../fixtures/getGroups';
import { getClassAsHeadmaster } from '../fixtures/getClass';

describe('Education forecast navigation', () => {
  beforeEach(() => {
    cy.viewport('macbook-16');
  });

  const setHeadMasterIntercepts = () => {
    cy.intercept('GET', '**/currentperiod/GR', getCurrentPeriod());
    cy.intercept('GET', '**/allperiods/GR', getAllPeriods());
    cy.intercept(
      'GET',
      '**/mygroups/*?OrderBy=GroupName&OrderDirection=ASC&periodId=*&groupType=K*&PageSize=10',
      getClassAsHeadmaster()
    );

    cy.visit('http://localhost:3000');
    cy.get('[data-cy="page-title"]').should('exist').contains('Klasser');
  };

  const setMentorIntercepts = () => {
    cy.intercept('GET', '**/currentperiod/GY', getCurrentPeriod());
    cy.intercept('GET', '**/allperiods/GY', getAllPeriods());
    cy.intercept('GET', '**/mygroups/**', getGroupsAsMentor());

    cy.visit('http://localhost:3000');
    cy.get('[data-cy="page-title"]').should('exist').contains('Mina ämnen/grupper');
  };

  const setTeacherIntercepts = () => {
    cy.intercept('GET', '**/currentperiod/GY', getCurrentPeriod());
    cy.intercept('GET', '**/allperiods/GY', getAllPeriods());
    cy.intercept('GET', '**/mygroups/**', getGroupAsTeacher());

    cy.visit('http://localhost:3000');
    cy.get('[data-cy="page-title"]').should('exist').contains('Mina ämnen/grupper');
  };

  it('displays navigation bar correctly as Headmaster with one school', () => {
    cy.intercept('GET', '**/api/me', getMeAsHeadmaster());
    setHeadMasterIntercepts();

    cy.get('[data-cy="navigation-bar"]').should('exist').contains('Klasser').click();
    cy.get('[data-cy="popup-0-link-item-a-a-a-a-a"]').should('not.exist');
    cy.get('[data-cy="popup-0-link-item-b-b-b-b-b"]').should('not.exist');

    cy.get('[data-cy="navigation-bar"]').should('exist').contains('Ämnen/grupper').click();
    cy.get('[data-cy="popup-0-link-item-a-a-a-a-a"]').should('not.exist');
    cy.get('[data-cy="popup-0-link-item-b-b-b-b-b"]').should('not.exist');

    cy.get('[data-cy="navigation-bar"]').should('exist').contains('Elever').click();
    cy.get('[data-cy="popup-0-link-item-a-a-a-a-a"]').should('not.exist');
    cy.get('[data-cy="popup-0-link-item-b-b-b-b-b"]').should('not.exist');

    cy.get('[data-cy="navigation-bar"]').should('exist').contains('Rektor Rektorsson');
  });

  it('displays navigation bar correctly as Headmaster with multiple schools', () => {
    cy.intercept('GET', '**/api/me', getMeAsHeadmasterMultipleSchools());
    setHeadMasterIntercepts();

    cy.get('[data-cy="navigation-bar"]').should('exist').contains('Klasser').click();
    cy.get('[data-cy="popup-0-link-item-a-a-a-a-a"]').should('exist');
    cy.get('[data-cy="popup-0-link-item-b-b-b-b-b"]').should('exist');

    cy.get('[data-cy="navigation-bar"]').should('exist').contains('Ämnen/grupper').click();
    cy.get('[data-cy="popup-0-link-item-a-a-a-a-a"]').should('exist');
    cy.get('[data-cy="popup-0-link-item-b-b-b-b-b"]').should('exist');

    cy.get('[data-cy="navigation-bar"]').should('exist').contains('Elever').click();
    cy.get('[data-cy="popup-0-link-item-a-a-a-a-a"]').should('exist');
    cy.get('[data-cy="popup-0-link-item-b-b-b-b-b"]').should('exist');

    cy.get('[data-cy="navigation-bar"]').should('exist').contains('Rektor Rektorsson');
  });

  it('displays navigation bar correctly as Mentor with one school', () => {
    cy.intercept('GET', '**/api/me', getMeAsMentor());
    setMentorIntercepts();

    cy.get('[data-cy="navigation-bar"]').should('exist').contains('Mina ämnen/grupper').click();
    cy.get('[data-cy="popup-menu-item-0-link"]').should('not.exist');
    cy.get('[data-cy="popup-menu-item-1-link"]').should('not.exist');

    cy.get('[data-cy="navigation-bar"]').should('exist').contains('Klasser').click();
    cy.get('[data-cy="popup-menu-class-item-0-link"]').should('exist');

    cy.get('[data-cy="navigation-bar"]').should('exist').should('not.have.text', 'Elever');
    cy.get('[data-cy="navigation-bar"]').should('exist').contains('Mentor Mentorsson');
  });

  it('displays navigation bar correctly as Mentor with multiple schools', () => {
    cy.intercept('GET', '**/api/me', getMeAsMentorMultipleSchools());
    setMentorIntercepts();
    cy.get('[data-cy="navigation-bar"]').should('exist').contains('Mina ämnen/grupper').click();
    cy.get('[data-cy="popup-menu-item-0-link"]').should('exist');
    cy.get('[data-cy="popup-menu-item-1-link"]').should('exist');

    cy.get('[data-cy="navigation-bar"]').should('exist').contains('Klasser').click();
    cy.get('[data-cy="popup-menu-class-item-0-link"]').should('exist');

    cy.get('[data-cy="navigation-bar"]').should('exist').should('not.have.text', 'Elever');
    cy.get('[data-cy="navigation-bar"]').should('exist').contains('Mentor Mentorsson');
  });

  it('displays navigation bar correctly as Teacher with one school', () => {
    cy.intercept('GET', '**/api/me', getMeAsTeacher());
    setTeacherIntercepts();

    cy.get('[data-cy="navigation-bar"]').should('exist').contains('Mina ämnen/grupper');
    cy.get('[data-cy="popup-menu-item-0-link"]').should('not.exist');
    cy.get('[data-cy="popup-menu-item-1-link"]').should('not.exist');
    cy.get('[data-cy="navigation-bar"]').should('exist').should('not.have.text', 'Klasser');
    cy.get('[data-cy="navigation-bar"]').should('exist').should('not.have.text', 'Elever');
    cy.get('[data-cy="navigation-bar"]').should('exist').contains('Lärare Lärarson');
  });

  it('displays navigation bar correctly as Teacher with multiple schools', () => {
    cy.intercept('GET', '**/api/me', getMeAsTeacherMultipleSchools());
    setTeacherIntercepts();

    cy.get('[data-cy="navigation-bar"]').should('exist').contains('Mina ämnen/grupper');
    cy.get('[data-cy="popup-menu-item-0-link"]').should('exist');
    cy.get('[data-cy="popup-menu-item-1-link"]').should('exist');
    cy.get('[data-cy="navigation-bar"]').should('exist').should('not.have.text', 'Klasser');
    cy.get('[data-cy="navigation-bar"]').should('exist').should('not.have.text', 'Elever');
    cy.get('[data-cy="navigation-bar"]').should('exist').contains('Lärare Lärarson');
  });
});
