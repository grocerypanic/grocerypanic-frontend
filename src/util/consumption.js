import {
  islastWeek,
  islastMonth,
  isWithinAWeek,
  isWithinAMonth,
} from "./datetime";

export const consumedWithinThisWeek = (transaction_values) => {
  const results = transaction_values.filter(
    (o) => o.quantity < 0 && isWithinAWeek(o.datetime)
  );
  return Math.abs(results.reduce((c, o) => (c += o.quantity), 0));
};

export const consumedWithinThisMonth = (transaction_values) => {
  const results = transaction_values.filter(
    (o) => o.quantity < 0 && isWithinAMonth(o.datetime)
  );
  return Math.abs(results.reduce((c, o) => (c += o.quantity), 0));
};

export const consumedInLastWeek = (transaction_values) => {
  const results = transaction_values.filter(
    (o) => o.quantity < 0 && islastWeek(o.datetime)
  );
  return Math.abs(results.reduce((c, o) => (c += o.quantity), 0));
};

export const consumedInLastMonth = (transaction_values) => {
  const results = transaction_values.filter(
    // TODO: Change to actual last month
    (o) => o.quantity < 0 && islastMonth(o.datetime)
  );
  return Math.abs(results.reduce((c, o) => (c += o.quantity), 0));
};
