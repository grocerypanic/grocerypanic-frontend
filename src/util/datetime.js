import moment from "moment";

export const islastWeek = (dateObject) => {
  return (
    dateObject.isAfter(moment().subtract(2, "weeks").startOf("week")) &&
    dateObject.isBefore(moment().subtract(1, "weeks").endOf("week"))
  );
};

export const islastMonth = (dateObject) => {
  return (
    dateObject.isAfter(moment().subtract(2, "months").startOf("month")) &&
    dateObject.isBefore(moment().subtract(1, "months").endOf("month"))
  );
};

export const isWithinAWeek = (dateObject) => {
  return (
    dateObject.isAfter(moment().startOf("week")) &&
    dateObject.isBefore(moment())
  );
};

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
