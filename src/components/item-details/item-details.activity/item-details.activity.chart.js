import {
  Chart,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  Title,
  PointElement,
} from "chart.js";
import { graph } from "../../../configuration/theme";

Chart.register(
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  Title,
  PointElement
);

export const renderChart = (translateFn, activity_last_two_weeks, item) => {
  const [quantities, changes] = generateChartData(
    activity_last_two_weeks,
    item
  );
  const labels = [translateFn("ItemActivity.GraphNow")];
  const dayMarker = translateFn("ItemActivity.GraphDayShortForm");

  activity_last_two_weeks.slice(1).forEach((_, index) => {
    const key = index * -1 - 1;
    labels.push(`${key}${dayMarker}`);
  });

  const ActivityChart = new Chart(generateCtx(), {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: translateFn("ItemActivity.GraphChangeEvent"),
          borderColor: graph.changeLine,
          data: changes.map((o, index) => {
            return { y: o, x: index };
          }),
        },
        {
          label: translateFn("ItemActivity.GraphQuantity"),
          borderColor: graph.quantityLine,
          data: quantities.map((o, index) => {
            return { y: o, x: index };
          }),
        },
      ],
    },
    options: generateChartOptions(item, translateFn),
  });
  ActivityChart.render();
  return ActivityChart;
};

export const generateChartData = (activity_last_two_weeks, item) => {
  const changes = [];
  const quantities = [item.quantity];

  let quantity = item.quantity;

  activity_last_two_weeks.forEach((activity) => {
    changes.push(activity.change);
    quantity -= activity.change;
    quantities.push(quantity);
  });

  return [quantities, changes];
};

const generateChartOptions = (item, translateFn) => {
  return {
    scales: {
      y: {
        ticks: {
          maxTicksLimit: 14,
          major: {
            enabled: true,
          },
          precision: 1,
          label: {
            position: "left",
          },
        },
      },
      x: {
        display: true,
      },
    },
    plugins: {
      title: {
        text: item.name + ` (${translateFn("ItemActivity.GraphSubTitle")})`,
        display: true,
      },
      legend: {
        display: false,
        position: "bottom",
        generateLabels: nullFunction,
      },
    },
    layout: {
      padding: {
        left: 0,
        right: 5,
        top: graph.topPadding,
        bottom: 0,
      },
      margin: -1,
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

export const nullFunction = () => null;
