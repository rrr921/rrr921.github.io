import {
  categoryColors,
  sleepData,
  caffeineIntakeLabels,
  averageSleepDuration,
} from "./data.js";
import { calculateSleepData } from "./utils.js";

export const createBubbles = (drinksData) => {
  return drinksData.map((drink) => ({
    text: drink.name,
    size: (drink.caffeine * 1.5 * screen.width) / 1400,
    caffeine: drink.caffeine,
    color: categoryColors[drink.type],
    type: drink.type,
  }));
};

export const initPieChartData = (idx) => {
  return {
    datasets: [
      {
        data: [
          sleepData[idx].totalSleep - sleepData[idx].movement,
          sleepData[idx].movement,
          12 - sleepData[idx].totalSleep,
        ],
        backgroundColor: [
          "rgba(173, 107, 65, 0.3)",
          "rgba(238, 133, 61, 0.8)",
          "rgba(255, 255, 255, 1)",
        ],
      },
      {
        data: [sleepData[idx].totalSleep, 12 - sleepData[idx].totalSleep],
        backgroundColor: ["rgba(158, 67, 9, 0.8)", "rgba(255, 255, 255, 1)"],
      },
      {
        data: [
          sleepData[idx].effectiveSleep,
          12 - sleepData[idx].effectiveSleep,
        ],
        backgroundColor: ["rgba(83, 19, 0, 0.8)", "rgba(255, 255, 255, 1)"],
      },
      {
        data: 0,
        backgroundColor: ["rgba(255, 255, 255, 0)"],
      },
    ],
  };
};

export const updateBarChart = (sleepDurationChart) => {
  const caffeine = parseInt(document.getElementById("caf-input").value);
  if (caffeine !== null && caffeine >= 0) {
    const index = caffeineIntakeLabels.findIndex((label) => label > caffeine);
    sleepDurationChart.data.datasets[0].backgroundColor =
      averageSleepDuration.map(() => "rgba(133, 71, 39, 1)");

    if (index === 0) {
    } else if (index === -1) {
      sleepDurationChart.data.datasets[0].backgroundColor[
        caffeineIntakeLabels.length - 1
      ] = "rgba(224, 185, 146, 1)";
      sleepDurationChart.data.datasets[0].borderColor[
        caffeineIntakeLabels.length - 1
      ] = "rgba(224, 185, 146, 1)";
    } else {
      sleepDurationChart.data.datasets[0].backgroundColor[index - 1] =
        "rgba(224, 185, 146, 1)";
      sleepDurationChart.data.datasets[0].borderColor[index - 1] =
        "rgba(224, 185, 146, 1)";
    }
    sleepDurationChart.update();
  }
};

export const updatePieChart = () => {
  const idx = Math.floor(calculateSleepData());
  const chart = Chart.getChart("pie-chart");
  if (chart) {
    chart.data.datasets[0].data = [
      sleepData[idx].totalSleep - sleepData[idx].movement,
      sleepData[idx].movement,
      12 - sleepData[idx].totalSleep,
    ];

    chart.data.datasets[1].data = [
      sleepData[idx].totalSleep,
      12 - sleepData[idx].totalSleep,
    ];

    chart.data.datasets[2].data = [
      sleepData[idx].effectiveSleep,
      12 - sleepData[idx].effectiveSleep,
    ];
    chart.update();
  }
};
