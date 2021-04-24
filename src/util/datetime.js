import moment from "moment";

export const isWithinAMonth = (dateObject) => {
  return (
    dateObject.isAfter(moment().startOf("month")) &&
    dateObject.isBefore(moment())
  );
};

export const within7Days = (dateObject) => {
  return (
    dateObject.isAfter(moment()) &&
    dateObject.isBefore(moment().add(7, "days").startOf("day"))
  );
};

export const expired = (dateObject) => {
  return dateObject.isBefore(moment());
};
