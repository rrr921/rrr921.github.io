import { updateProgressBar } from "./utils.js";

import { caffeineAmountMap } from "./data.js";

import { updateBarChart, updatePieChart } from "./chartUtils.js";
import { barChartData } from "./chartData.js";
import { drawBubbleChart, createBarChart, createPieChart } from "./chart.js";
import { createSankey1, createSankey2 } from "./sankey.js";

window.onload = () => {
  updateProgressBar();
  drawBubbleChart();
  createSankey1();
  createSankey2();
};

document.getElementById("coffee").addEventListener("input", drawBubbleChart);
document
  .getElementById("energyDrinks")
  .addEventListener("input", drawBubbleChart);
document
  .getElementById("softDrinks")
  .addEventListener("input", drawBubbleChart);

let caffeineValue = 0;
let totalCaffeine = 0;

const sleepDurationChart = createBarChart("bar-chart", barChartData);

document.querySelectorAll(".beverage-item").forEach((item) => {
  const quantityInput = item.querySelector(".quantity");
  quantityInput.addEventListener("input", () => {
    let quantity = parseInt(quantityInput.value);
    if (isNaN(quantity) || quantity < 0) {
      quantity = 0;
    }
    quantityInput.value = quantity;
    totalCaffeine = Object.keys(caffeineAmountMap).reduce((total, type) => {
      const inputElement = document.getElementById(type);
      const inputValue = inputElement ? parseInt(inputElement.value) || 0 : 0;
      return total + inputValue * caffeineAmountMap[type];
    }, 0);
    caffeineValue = totalCaffeine;
    document.getElementById("caf-input").value = totalCaffeine;
    updateProgressBar();
  });
});

// 监听输入变化
document.querySelectorAll(".quantity").forEach((input) => {
  input.addEventListener("input", () => {
    updatePieChart();
  });
});

let pieChartCreated = false;
let bubbleUpdated = false;
// 监听滚动事件
window.addEventListener("scroll", () => {
  const cover = document.getElementById("cover");
  const scrollY = window.scrollY;
  const opacity = 1 - Math.min(scrollY / 100, 1);
  cover.style.opacity = opacity;

  if (opacity === 0) {
    cover.classList.add("hidden");
  } else {
    cover.classList.remove("hidden");
  }

  const wordBubble = document.getElementById("bubble-chart");
  const bubbleRect = wordBubble.getBoundingClientRect();
  if (bubbleRect.top < 270 && !bubbleUpdated) {
    bubbleUpdated = true;
    drawBubbleChart();
  }
  const barChart = document.getElementById("bar-chart");
  const barChartRect = barChart.getBoundingClientRect();
  if (barChartRect.top < 800) {
    updateBarChart(sleepDurationChart);
  }

  const pieChart = document.getElementById("pie-chart");
  const pieChartRect = pieChart.getBoundingClientRect();
  if (pieChartRect.top < 400 && !pieChartCreated) {
    pieChartCreated = true;
    createPieChart();
  }
});
