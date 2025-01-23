import { caffeineIntakeLabels, averageSleepDuration } from "./data.js";

export const barChartData = {
  labels: caffeineIntakeLabels,
  datasets: [
    {
      label: "Average Sleep Duration (hours)",
      backgroundColor: averageSleepDuration.map(() => "rgba(133, 71, 39, 1)"),
      borderColor: averageSleepDuration.map(() => "rgba(133, 71, 39, 1)"),
      borderWidth: 1,
      data: averageSleepDuration,
      type: "bar",
      shadowColor: "rgba(133, 71, 39, 1)",
      shadowBlur: 100,
      shadowOffsetX: 0,
      shadowOffsetY: 5,
    },
  ],
};
