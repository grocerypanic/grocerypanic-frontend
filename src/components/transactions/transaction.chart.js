import moment from "moment";
import { Constants } from "../../configuration/backend";
import Chart from "chart.js";

import { graph } from "../../configuration/theme";

export const renderChart = (translateFn, transactions, item) => {
  const [quantities, changes] = generateChartData(transactions, item);

  const ActivityChart = new Chart(generateCtx(), {
    type: "line",
    data: {
      labels: [...Array(Constants.maximumTransactionHistory + 1).keys()],
      datasets: [
        {
          label: translateFn("ItemStats.GraphChangeEvent"),
          borderColor: graph.changeLine,
          data: changes.map((o, index) => {
            return { y: o, x: index };
          }),
        },
        {
          label: translateFn("ItemStats.GraphQuantity"),
          borderColor: graph.quantityLine,
          data: quantities.map((o, index) => {
            return { y: o, x: index };
          }),
        },
      ],
    },
    options: generateChartOptions(item),
  });
  ActivityChart.render();
  return ActivityChart;
};

export const generateChartData = (transactions, item) => {
  const changes = [];
  const quantities = [item.quantity];

  let quantity = item.quantity;
  [...Array(Constants.maximumTransactionHistory + 1).keys()].forEach((i) => {
    let total_change = 0;
    transactions.forEach((transaction) => {
      if (timedelta(transaction.datetime) === i) {
        total_change += transaction.quantity;
      }
    });
    changes.push(total_change);
    quantity -= total_change;
    quantities.push(quantity);
  });

  return [quantities, changes];
};

const generateChartOptions = (item) => {
  return {
    scales: {
      yAxes: [
        {
          ticks: {
            maxTicksLimit: 9,
            precision: 0,
          },
        },
      ],
    },
    title: {
      text: item.name + " (past 2 weeks)",
      display: true,
    },
    legend: {
      display: false,
      generateLabels: nullFunction,
    },
    layout: {
      padding: {
        left: 0,
        right: 5,
        top: graph.topPadding,
        bottom: 0,
      },
      margin: 0,
    },
    responsive: true,
    maintainAspectRatio: false,
  };
};

const generateCtx = () => {
  const ctx = document.getElementById("consumptionChart").getContext("2d");
  ctx.clearRect(0, 0, ctx.width, ctx.height);
  return ctx;
};

const timedelta = (timestamp) => {
  return timestamp.diff(moment(), "days") * -1;
};

/* istanbul ignore next */
const nullFunction = () => null;
