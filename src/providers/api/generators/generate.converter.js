import moment from "moment";

export const DATEFIELDS = {
  item: "next_expiry_date",
  transaction: "datetime",
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
