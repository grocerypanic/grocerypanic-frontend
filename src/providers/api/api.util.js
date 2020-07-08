import moment from "moment";

const DATEFIELDS = {
  item: "next_expiry_date",
  transaction: "datetime",
};

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

export const generateConverter = (objectClass) => {
  let field = DATEFIELDS[objectClass];
  const convertToMoment = (object) => {
    let converted_value;
    switch (field) {
      case "next_expiry_date":
        if (typeof object[field] === "object") return object;
        converted_value = moment.utc(object[field]).unix();
        converted_value = moment
          .unix(converted_value)
          .add(moment().utcOffset(), "minutes")
          .set({ hour: 23, minute: 59, second: 59, millisecond: 999 });
        object[field] = converted_value;
        return object;
      case "datetime":
        if (typeof object[field] === "object") return object;
        converted_value = moment.utc(object[field]);
        object[field] = converted_value;
        return object;
      default:
        return object;
    }
  };
  return convertToMoment;
};
