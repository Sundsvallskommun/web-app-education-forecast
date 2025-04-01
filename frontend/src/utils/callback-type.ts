export const callbackType = (string: string) => {
  const CLASSES = string === 'classes';
  const MENTORCLASS = string === 'mentorclass';
  const SUBJECTS = string === 'subjects';
  const SUBJECT = string === 'subject';
  const PUPILS = string === 'pupils';
  const PUPIL = string === 'pupil';
  const PERIOD = string === 'period';

  return {
    CLASSES,
    MENTORCLASS,
    SUBJECTS,
    SUBJECT,
    PUPILS,
    PUPIL,
    PERIOD,
  };
};
