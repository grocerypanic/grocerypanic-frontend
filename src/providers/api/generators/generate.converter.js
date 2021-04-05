import moment from "moment";

export const DATE_OBJECT_FIELD_TYPES = {
  item: "next_expiry_date",
  transaction: "datetime",
  activity: "activity_first",
};

const DATE_OBJECT_TIME_OF_DAY = {
  item: { hour: 23, minute: 59, second: 59, millisecond: 999 },
};

const utc2Local = (datetimeObjec) => {
  return moment.utc(datetimeObjec).local();
};

export const generateConverter = (dateObjectField) => {
  let field = DATE_OBJECT_FIELD_TYPES[dateObjectField];
  const convertToMoment = (originalDateObject) => {
    if (Object.values(DATE_OBJECT_FIELD_TYPES).includes(field)) {
      if (!(originalDateObject[field] instanceof moment)) {
        let convertedDateTime = utc2Local(originalDateObject[field]);
        if (Object.keys(DATE_OBJECT_TIME_OF_DAY).includes(dateObjectField)) {
          convertedDateTime = convertedDateTime.set(
            DATE_OBJECT_TIME_OF_DAY[dateObjectField]
          );
        }
        originalDateObject[field] = convertedDateTime;
      }
    }
    return originalDateObject;
  };
  return convertToMoment;
};

export const generateUTCConverter = (dateObjectField) => {
  let field = DATE_OBJECT_FIELD_TYPES[dateObjectField];
  const convertToMoment = (originalDateObject) => {
    if (!(originalDateObject[field] instanceof moment)) {
      let convertedDateTime = moment.utc(originalDateObject[field]);
      originalDateObject[field] = convertedDateTime;
    }
    return originalDateObject;
  };
  return convertToMoment;
};
