import { ApiResponse } from '@services/api-service';
import { User } from '@interfaces/user';

export const getMeAsHeadmaster: () => ApiResponse<User> = () => ({
  data: {
    personId: 'a-a-a-a-a',
    name: 'Rektor Rektorsson',
    username: 'rek00tor',
    roles: [{ role: 'ForecastUser', typeOfSchool: 'GR' }],
    schools: [{ schoolId: 'a-a-a-a-a', schoolName: 'Sundsvalls Grundskola 1' }],
  },
  message: 'success',
});

export const getMeAsHeadmasterMultipleSchools: () => ApiResponse<User> = () => ({
  data: {
    personId: 'a-a-a-a-a',
    name: 'Rektor Rektorsson',
    username: 'rek00tor',
    roles: [{ role: 'ForecastUser', typeOfSchool: 'GR' }],
    schools: [
      { schoolId: 'a-a-a-a-a', schoolName: 'Sundsvalls Grundskola 1' },
      { schoolId: 'b-b-b-b-b', schoolName: 'Sundsvalls Grundskola 2' },
    ],
  },
  message: 'success',
});

export const getMeAsTeacher: () => ApiResponse<User> = () => ({
  data: {
    personId: 'b-b-b-b-b',
    name: 'Lärare Lärarson',
    username: 'lar00are',
    roles: [
      {
        role: 'GradeAuthor',
        typeOfSchool: 'GY',
      },
    ],
    schools: [{ schoolId: 'a-a-a-a-a', schoolName: 'Sundsvalls Gymnasium 1' }],
  },
  message: 'success',
});

export const getMeAsTeacherMultipleSchools: () => ApiResponse<User> = () => ({
  data: {
    personId: 'b-b-b-b-b',
    name: 'Lärare Lärarson',
    username: 'lar00are',
    roles: [
      {
        role: 'GradeAuthor',
        typeOfSchool: 'GY',
      },
      {
        role: 'GradeAuthor',
        typeOfSchool: 'GY',
      },
    ],
    schools: [
      { schoolId: 'a-a-a-a-a', schoolName: 'Sundsvalls Gymnasium 1' },
      { schoolId: 'b-b-b-b-b', schoolName: 'Sundsvalls Gymnasium 2' },
    ],
  },
  message: 'success',
});

export const getMeAsMentor: () => ApiResponse<User> = () => ({
  data: {
    personId: 'c-c-c-c-c',
    name: 'Mentor Mentorsson',
    username: 'men00tor',
    roles: [
      {
        role: 'GradeAuthor',
        typeOfSchool: 'GY',
      },
      { role: 'Mentor', typeOfSchool: 'GY' },
    ],
    schools: [{ schoolId: 'a-a-a-a-a', schoolName: 'Sundsvalls Gymnasium 1' }],
  },
  message: 'success',
});

export const getMeAsMentorMultipleSchools: () => ApiResponse<User> = () => ({
  data: {
    personId: 'c-c-c-c-c',
    name: 'Mentor Mentorsson',
    username: 'men00tor',
    roles: [
      {
        role: 'GradeAuthor',
        typeOfSchool: 'GY',
      },
      { role: 'Mentor', typeOfSchool: 'GY' },
      {
        role: 'GradeAuthor',
        typeOfSchool: 'GY',
      },
      { role: 'Mentor', typeOfSchool: 'GY' },
    ],
    schools: [
      { schoolId: 'a-a-a-a-a', schoolName: 'Sundsvalls Gymnasium 1' },
      { schoolId: 'b-b-b-b-b', schoolName: 'Sundsvalls Gymnasium 2' },
    ],
  },
  message: 'success',
});
