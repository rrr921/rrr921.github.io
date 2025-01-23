import {
  calculateSleepData,
  getBeverageQuantities,
  wrapText,
  centerTextPlugin,
} from "./utils.js";
import { createBubbles, initPieChartData } from "./chartUtils.js";
import { drinksData } from "./data.js";

export const drawBubbleChart = () => {
  const svg = d3.select("#bubble-chart");
  const width = screen.width;
  const height = screen.height;
  svg.attr("width", width).attr("height", height);
  const beverageQuantities = getBeverageQuantities();
  const bubbles = createBubbles(drinksData);
  const ticked = () => {
    const bubble = svg
      .selectAll("circle")
      .data(bubbles)
      .join("circle")
      .attr("r", (d) => d.size)
      .attr("fill", (d) => {
        return (d.type === "coffee" && beverageQuantities.coffee > 0) ||
          (d.type === "energyDrinks" && beverageQuantities.energyDrinks > 0) ||
          (d.type === "softDrinks" && beverageQuantities.softDrinks > 0)
          ? d.color
          : "gray";
      })
      .attr("opacity", 0.8)
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .on("mouseover", (event, d) => showBubbleLabel(event, d))
      .on("mouseout", hideBubbleLabel);

    bubble.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

    const text = svg
      .selectAll("text")
      .data(bubbles)
      .join("text")
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y - d.size * 0.15)
      .attr("font-size", (d) => `${d.size * 0.27}px`);

    text
      .selectAll("tspan")
      .data((d) => wrapText(d.text, 10))
      .join("tspan")
      .text((d) => d)
      .attr("x", (d, i, nodes) => nodes[i].parentNode.getAttribute("x"))
      .attr("dy", (d, i) => `${i > 0 ? 1 : 0}em`)
      .attr("font-size", (d) => `${d.size * 0.1}px`);
  };
  const simulation = d3
    .forceSimulation(bubbles)
    .force(
      "x",
      d3
        .forceX()
        .strength(0.15)
        .x(width / 2)
    )
    .force(
      "y",
      d3
        .forceY()
        .strength(0.9)
        .y(height / 2)
    )
    .force(
      "collide",
      d3.forceCollide().radius((d) => d.size + 5)
    )
    .on("tick", ticked);

  const showBubbleLabel = (event, d) => {
    const labelText = `${d.text}: ${d.caffeine} mg/100ml`;
    const textElement = svg
      .append("text")
      .attr("class", "bubble-label")
      .attr("x", d.x)
      .attr("y", d.y - d.size * 0.2)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "20px")
      .text(labelText);

    const bbox = textElement.node().getBBox();
    svg
      .append("rect")
      .attr("class", "bubble-label-bg")
      .attr("x", bbox.x - 5)
      .attr("y", bbox.y - 5)
      .attr("width", bbox.width + 10)
      .attr("height", bbox.height + 10)
      .attr("fill", "#824a4a")
      .attr("opacity", 0.95)
      .attr("rx", 10);
    textElement.raise();
  };

  const hideBubbleLabel = () => {
    svg.selectAll(".bubble-label").remove();
    svg.selectAll(".bubble-label-bg").remove();
  };
};

export const createBarChart = (chartId, data) => {
  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Average Sleep Duration vs Caffeine Intake",
        font: {
          size: 18,
        },
      },
      // 添加数据标签插件配置
      datalabels: {
        anchor: "start",
        align: "start",
        formatter: (value) => {
          return (value + 7.4712).toFixed(2); // 显示减去 7.4712 前的数值
        },
        color: "black",
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Caffeine Intake (mg)" },
        ticks: { autoSkip: false, labelOffset: -40 },
        grid: { drawOnChartArea: false },
      },
      y: {
        display: false,
      },
    },
    animation: { duration: 1000, easing: "easeInOutQuad" },
    barPercentage: 0.5,
    categoryPercentage: 1.0,
  };

  return new Chart(document.getElementById(chartId), {
    type: "bar",
    data: data,
    options: options,
  });
};

export const createPieChart = () => {
  const idx = Math.floor(calculateSleepData()) || 0;
  const ctx = document.getElementById("pie-chart").getContext("2d");
  const data = initPieChartData(idx);

  const options = {
    responsive: true,
    animation: {
      duration: 1500,
      easing: "easeInOutQuad",
    },
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: "Sleep quality",
        font: {
          size: 24,
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            `${tooltipItem.label}: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  return new Chart(ctx, {
    type: "pie",
    data: data,
    options: options,
    plugins: [centerTextPlugin],
  });
};
