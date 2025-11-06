import { ApiResponse } from '@services/api-service';
import dayjs from 'dayjs';
import { MetaPupils, Pupil } from '@interfaces/forecast/forecast';

export const getPupilsAsHeadmaster: () => ApiResponse<MetaPupils> = () => ({
  data: {
    pageNumber: 1,
    pageSize: 10,
    totalRecords: 2,
    totalPages: 1,
    data: [
      {
        givenname: 'Elev',
        lastname: 'Elevsson',
        className: '1',
        pupil: 'a-a-a-a-a',
        groupId: 'a-a-a-a-a',
        schoolYear: Number(dayjs().format('YYYY')),
        forecastPeriod: '21',
        approved: 0,
        warnings: 0,
        unapproved: 0,
        subjectsOpenToForecast: 0,
        totalSubjects: 9,
        presence: 98,
        unitId: 'a-a-a-a-a',
        typeOfSchool: 'GR',
        teachers: [
          {
            givenname: 'Lärare',
            lastname: 'Läraresson',
            personId: 'a-a-a-a-a',
            email: Cypress.env('mockEmail'),
          },
        ],
      },
      {
        givenname: 'Eleven',
        lastname: 'Elevensson',
        className: '1',
        pupil: 'b-b-b-b-b',
        groupId: 'a-a-a-a-a',
        schoolYear: Number(dayjs().format('YYYY')),
        forecastPeriod: '21',
        approved: 0,
        warnings: 0,
        unapproved: 0,
        subjectsOpenToForecast: 0,
        totalSubjects: 18,
        presence: 91,
        unitId: 'a-a-a-a-a',
        typeOfSchool: 'GR',
        teachers: [
          {
            givenname: 'Lärare',
            lastname: 'Läraresson',
            personId: 'a-a-a-a-a',
            email: Cypress.env('mockEmail'),
          },
        ],
      },
    ],
  },
  message: 'success',
});

export const getPupilsBySubjectAsMentor: () => ApiResponse<Pupil[]> = () => ({
  data: [
    {
      pupil: 'a-a-a-a-a',
      groupId: 'a-a-a-a-a',
      forecastPeriod: null,
      schoolYear: null,
      subjectsOpenToForecast: null,
      forecast: null,
      previousForecast: null,
      forecastTeacher: null,
      givenname: 'Elev',
      lastname: 'Elevsson',
      className: '1',
      classGroupId: 'a-a-a-a-a',
      courseName: '1',
      courseId: 'A',
      syllabusId: '0-0-0-0-0',
      presence: 100,
      unitId: 'a-a-a-a-a',
      typeOfSchool: 'GR',
      teachers: [
        {
          givenname: 'Mentor',
          lastname: 'Mentorsson',
          personId: 'a-a-a-a-a',
          email: Cypress.env('mockEmail'),
        },
      ],
      totalSubjects: null,
    },
  ],
  message: 'success',
});

export const getSetPupilForecast: () => ApiResponse<Pupil[]> = () => ({
  data: [
    {
      pupil: 'a-a-a-a-a',
      groupId: 'a-a-a-a-a',
      forecastPeriod: null,
      schoolYear: null,
      subjectsOpenToForecast: null,
      forecast: 1,
      previousForecast: null,
      forecastTeacher: null,
      givenname: 'Elev',
      lastname: 'Elevsson',
      className: '1',
      classGroupId: 'a-a-a-a-a',
      courseName: '1',
      courseId: 'A',
      syllabusId: '0-0-0-0-0',
      presence: 100,
      unitId: 'a-a-a-a-a',
      typeOfSchool: 'GR',
      teachers: [
        {
          givenname: 'Mentor',
          lastname: 'Mentorsson',
          personId: 'a-a-a-a-a',
          email: Cypress.env('mockEmail'),
        },
      ],
      totalSubjects: null,
    },
  ],
  message: 'success',
});
