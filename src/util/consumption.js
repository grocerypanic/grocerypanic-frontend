import { isWithinAWeek, isWithinAMonth } from "./datetime";

export const consumedWithinLastWeek = (transaction_values) => {
  const results = transaction_values.filter(
    (o) => o.quantity < 0 && isWithinAWeek(o.datetime)
  );
  return Math.abs(results.reduce((c, o) => (c += o.quantity), 0));
};

export const consumedWithinLastMonth = (transaction_values) => {
  const results = transaction_values.filter(
    (o) => o.quantity < 0 && isWithinAMonth(o.datetime)
  );
  return Math.abs(results.reduce((c, o) => (c += o.quantity), 0));
};

export const averageWeeklyConsumption = (transaction_values) => {
  const results = {};
  transaction_values.forEach((o) => {
    if (o.quantity > 0) return;
    const header =
      String(o.datetime.isoWeekYear()) + String(o.datetime.isoWeek());
    if (results[header]) {
      results[header] += o.quantity;
    } else {
      results[header] = o.quantity;
    }
  });
  if (Object.values(results).length === 0) return 0;
  const sum = Object.values(results).reduce((a, b) => a + b, 0);
  const avg = Math.abs(sum / Object.values(results).length).toFixed(1);
  return avg;
};

export const averageMonthlyConsumption = (transaction_values) => {
  const results = {};
  transaction_values.forEach((o) => {
    if (o.quantity > 0) return;
    const header = String(o.datetime.year()) + String(o.datetime.month());
    if (results[header]) {
      results[header] += o.quantity;
    } else {
      results[header] = o.quantity;
    }
  });
  if (Object.values(results).length === 0) return 0;
  const sum = Object.values(results).reduce((a, b) => a + b, 0);
  const avg = Math.abs(sum / Object.values(results).length).toFixed(1);
  return avg;
};
