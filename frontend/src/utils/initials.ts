export const initialsFunction = (name) => {
  const nameArr = name.split('');
  const initials = nameArr.filter(function (char) {
    return /[A-Z]/.test(char);
  });

  return initials.join('');
};
