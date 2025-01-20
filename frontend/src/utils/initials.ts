export const initialsFunction = (name: string) => {
  const nameArr = name.split('');
  const initials = nameArr.filter(function (char) {
    return /[A-Z]/.test(char);
  });

  return initials.join('');
};
