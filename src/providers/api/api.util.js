import moment from "moment";

const DATEFIELDS = ["next_expiry_date", "date"];

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

export const convertDatesToLocal = (object) => {
  let alreadyConverted = false;
  DATEFIELDS.forEach((field) => {
    if (object[field]) {
      if (typeof object[field] === "object") alreadyConverted = true;
    }
    return false;
  });

  if (alreadyConverted) return object;

  let newItem = { ...object };

  DATEFIELDS.forEach((field) => {
    if (newItem[field]) {
      newItem[field] = moment
        .utc(object[field])
        .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
        .add(moment().utcOffset(), "minutes");
    }
  });

  return newItem;
};
