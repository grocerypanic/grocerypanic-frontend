export const apiResultCompare = (a, b) => {
  const name1 = a.name.toUpperCase();
  const name2 = b.name.toUpperCase();

  let comparison = 0;
  if (name1 > name2) {
    comparison = 1;
  } else if (name1 < name2) {
    comparison = -1;
  }
  return comparison;
};
