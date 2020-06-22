export const apiResultCompare = (a, b) => {
  let name1, name2;

  if (a.hasOwnProperty("name") && b.hasOwnProperty("name")) {
    name1 = a.name.toUpperCase();
    name2 = b.name.toUpperCase();
  } else {
    name1 = a.id;
    name2 = b.id;
  }

  let comparison = 0;
  if (name1 > name2) {
    comparison = 1;
  } else if (name1 < name2) {
    comparison = -1;
  }
  return comparison;
};
