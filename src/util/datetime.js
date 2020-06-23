import moment from "moment";

export const isWithinAWeek = (dateObject) => {
  return (
    dateObject.isAfter(moment().subtract(7, "days").startOf("day")) &&
    dateObject.isBefore(moment())
  );
};

export const isWithinAMonth = (dateObject) => {
  return (
    dateObject.isAfter(moment().subtract(1, "months").startOf("day")) &&
    dateObject.isBefore(moment())
  );
};

export const nextWeek = (dateObject) => {
  return (
    dateObject.isBefore(moment().add(7, "days").startOf("day")) &&
    dateObject.isAfter(moment())
  );
};
