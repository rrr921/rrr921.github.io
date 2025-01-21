const caffeineInput = document.getElementById("caf-input");
const progressBar = document.getElementById("progress-bar");
const controlBar = document.getElementById("control-bar");

const updateImageBorders = (caffeineValue) => {
  const images = document.querySelectorAll(".grid-item");
  const calculatedIndex = Math.floor(caffeineValue / 50) + 1;
  if (caffeineValue === 0) {
    calculatedIndex = 0;
  }
  images.forEach((img, index) => {
    img.style.border = index === calculatedIndex ? "2px solid brown" : "none";
  });
};

const updateProgressBar = () => {
  const inputValue = Math.min(Math.max(caffeineInput.value, 0), 400);
  progressBar.style.width = `${inputValue}px`;
  const points = document.querySelectorAll(".point");
  points.forEach((point) => point.remove());
  for (let i = 0; i <= 8; i++) {
    const point = document.createElement("div");
    point.classList.add("point");
    point.style.left = `${i * 50}px`;
    point.style.backgroundColor = i * 50 <= inputValue ? "#53030e" : "#e8d6cc";
    controlBar.appendChild(point);
  }
  updateImageBorders(parseInt(caffeineInput.value));
};

caffeineInput.addEventListener("input", updateProgressBar);

window.onload = () => {
  updateProgressBar();
  drawBubbleChart();
  createSankey1();
  createSankey2();
};

const caffeineIntakeLabels = [0, 50, 100, 150, 200, 250, 300, 350, 400];
const averageSleepDuration = [
  7.4888 - 7.4712,
  7.5176 - 7.4712,
  7.3586 - 7.4712,
  7.3743 - 7.4712,
  7.4942 - 7.4712,
  7.4967 - 7.4712,
  8.0532 - 7.4712,
  7.7307 - 7.4712,
];

const drinksData = [
  { name: "Nescafe Gold", caffeine: 26.37976039, type: "coffee" },
  {
    name: "Starbucks Doubleshot Espresso",
    caffeine: 62.4295047,
    type: "coffee",
  },
  { name: "McDonalds Iced Coffee", caffeine: 39.10669143, type: "coffee" },
  { name: "7 Eleven Brewed Coffee", caffeine: 59.17459888, type: "coffee" },
  { name: "McDonalds Latte", caffeine: 30.00997515, type: "coffee" },
  { name: "McDonalds Mocha", caffeine: 35.29342148, type: "coffee" },
  {
    name: "Starbucks Caramel Macchiato",
    caffeine: 31.70067797,
    type: "coffee",
  },
  { name: "Starbucks Cold Brew Coffee", caffeine: 43.32425989, type: "coffee" },
  { name: "Starbucks Decaf Coffee", caffeine: 5.283446329, type: "coffee" },
  {
    name: "Starbucks Grande Caffe Americano",
    caffeine: 47.55101696,
    type: "coffee",
  },
  {
    name: "Starbucks Grande Caffe Latte",
    caffeine: 31.70067797,
    type: "coffee",
  },
  {
    name: "Starbucks Grande Caffe Mocha",
    caffeine: 36.9841243,
    type: "coffee",
  },
  {
    name: "Starbucks Grande Cappuccino",
    caffeine: 31.70067797,
    type: "coffee",
  },
  { name: "Starbucks Grande Coffee", caffeine: 65.51473448, type: "coffee" },
  { name: "Starbucks Iced Americano", caffeine: 47.55101696, type: "coffee" },
  {
    name: "Starbucks Nitro Cold Brew Coffee",
    caffeine: 59.17459888,
    type: "coffee",
  },
  { name: "Red Bull", caffeine: 31.97546714, type: "energyDrinks" },
  { name: "Monster Energy", caffeine: 33.8140565, type: "energyDrinks" },
  {
    name: "Mega Monster Energy Drink",
    caffeine: 33.8140565,
    type: "energyDrinks",
  },
  { name: "Monster Zero Sugar", caffeine: 29.58729944, type: "energyDrinks" },
  { name: "Mountain Dew Amp", caffeine: 30.00997515, type: "energyDrinks" },
  { name: "Pepsi", caffeine: 10.70778456, type: "softDrinks" },
  { name: "Coca-Cola Classic", caffeine: 9.580649343, type: "softDrinks" },
];

const categoryColors = {
  coffee: "rgba(139, 69, 19, 1)",
  energyDrinks: "rgba(60, 179, 113, 1)",
  softDrinks: "rgba(70, 130, 180, 1)",
};

const drawBubbleChart = () => {
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
  // 由于饮料名过长，这个函数用于控制饮料名在合适位置换行
  const wrapText = (text, maxCharsPerLine) => {
    const words = text.split(" ");
    const lines = [];
    let currentLine = "";

    words.forEach((word) => {
      if ((currentLine + word).length > maxCharsPerLine) {
        lines.push(currentLine.trim());
        currentLine = word + " ";
      } else {
        currentLine += word + " ";
      }
    });

    if (currentLine.trim()) {
      lines.push(currentLine.trim());
    }

    return lines;
  };
};

const getBeverageQuantities = () => {
  return {
    coffee: parseInt(document.getElementById("coffee").value) || 0,
    energyDrinks: parseInt(document.getElementById("energyDrinks").value) || 0,
    softDrinks: parseInt(document.getElementById("softDrinks").value) || 0,
  };
};

const createBubbles = (drinksData) => {
  return drinksData.map((drink) => ({
    text: drink.name,
    size: (drink.caffeine * 1.5 * screen.width) / 1400,
    caffeine: drink.caffeine,
    color: categoryColors[drink.type],
    type: drink.type,
  }));
};

document.getElementById("coffee").addEventListener("input", drawBubbleChart);
document
  .getElementById("energyDrinks")
  .addEventListener("input", drawBubbleChart);
document
  .getElementById("softDrinks")
  .addEventListener("input", drawBubbleChart);

const invertedSleepDuration = averageSleepDuration.map(
  (duration) => Math.max(...averageSleepDuration) - duration
);

let caffeineValue = 0;
let totalCaffeine = 0;

const createBarChart = (chartId, data) => {
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

const chartData1 = {
  labels: caffeineIntakeLabels,
  datasets: [
    {
      label: "Average Sleep Duration (hours)",
      backgroundColor: "rgba(133, 71, 39, 1)",
      borderColor: "rgba(133, 71, 39, 1)",
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

const sleepDurationChart = createBarChart("bar-chart", chartData1);

const updateBarChart = () => {
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

const caffeineAmountMap = {
  coffee: 150,
  energyDrinks: 100,
  softDrinks: 30,
};

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

const sleepData = [
  { sleepScore: 9.9, effectiveSleep: 7.4, totalSleep: 7.47, movement: 1.85 }, //default
  { sleepScore: 7.88, effectiveSleep: 5.9, totalSleep: 7.49, movement: 2.04 },
  { sleepScore: 3.46, effectiveSleep: 2.6, totalSleep: 7.52, movement: 2.01 },
  { sleepScore: 1.22, effectiveSleep: 0.9, totalSleep: 7.36, movement: 2.03 },
  { sleepScore: 0.95, effectiveSleep: 0.7, totalSleep: 7.37, movement: 2.0 },
  { sleepScore: 0.93, effectiveSleep: 0.7, totalSleep: 7.49, movement: 2.03 },
  { sleepScore: 0.93, effectiveSleep: 0.7, totalSleep: 7.5, movement: 2.08 },
  { sleepScore: 0.87, effectiveSleep: 0.7, totalSleep: 8.05, movement: 1.9 },
  { sleepScore: 0.91, effectiveSleep: 0.7, totalSleep: 7.73, movement: 1.6 },
];

const calculateSleepData = () => {
  const caffeine = parseInt(document.getElementById("caf-input").value);
  return caffeine / 50 + 1;
};

const centerTextPlugin = {
  id: "centerText",
  beforeDraw: (chart) => {
    const { ctx, chartArea } = chart;
    const { width, height } = chartArea;
    ctx.restore();
    ctx.font = `30px Arial`;
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(135, 72, 40, 1)";
    const idx = Math.floor(calculateSleepData()) || 0;

    const text = sleepData[idx].sleepScore;
    const textX = Math.round((width - ctx.measureText(text).width) / 2);
    const textY = height / 2 + 45;
    ctx.fillText(text, textX, textY);
    ctx.save();
  },
};

const createPieChart = () => {
  const idx = Math.floor(calculateSleepData()) || 0;
  const ctx = document.getElementById("pie-chart").getContext("2d");
  const data = {
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

const updatePieChart = () => {
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

// 监听输入变化
document.querySelectorAll(".quantity").forEach((input) => {
  input.addEventListener("input", () => {
    updatePieChart();
  });
});

const createSankey1 = async () => {
  const sankeyDiagram1 = document.getElementById("sankey-diagram1");
  const categoricalDimensionLabels = [
    "Study Hours",
    "Caffeine Intake",
    "Screen Time",
    "Sleep Duration",
  ];

  try {
    const data = await d3.csv("./assets/data/sankey1.csv");
    const caffeineIntake = data.map((row) => row["Caffeine Intake"]);
    const screenTime = data.map((row) => row["Screen Time"]);
    const categoricalDimensions = categoricalDimensionLabels.map((dimLabel) => {
      const values = data.map((row) => row[dimLabel]);
  
      return {
        values: values,
        label: dimLabel,
      };
    });
  
    const color = new Int8Array(data.length);
    const colorscale = [
      [0, "gray"],
      [1, "firebrick"],
    ];
  
    const layout = {
      width: screen.width * 0.8,
      height: screen.height * 0.7,
      plot_bgcolor: "#fbf7f6",
      paper_bgcolor: "#fbf7f6",
      xaxis: { title: { text: "Caffeine Intake" }, domain: [0, 0.45] },
      yaxis: { title: { text: "Study Hours" }, domain: [0, 0.5] },
      dragmode: "lasso",
      hovermode: "closest",
      title: {
        text: "Try to interact with the diagrams below!",
        font: {
          size: 20,
        },
        x: 0.5,
        xanchor: "center",
      },
    };
  
    const traces = [
      {
        type: "scatter",
        x: caffeineIntake,
        y: screenTime,
        marker: { color: "gray" },
        mode: "markers",
        xaxis: "x", // 指定x轴
        yaxis: "y", // 指定y轴
      },
      {
        type: "parcats",
        domain: { x: [0.55, 1], y: [0, 0.5] }, // 设置Sankey图的domain
        dimensions: categoricalDimensions,
        line: {
          colorscale: colorscale,
          cmin: 0,
          cmax: 1,
          color: color,
          shape: "hspline",
        },
        labelfont: { size: 14 },
        selected: { marker: { color: "firebrick" } },
        unselected: { marker: { opacity: 0.3 } },
      },
    ];
  
    Plotly.newPlot("sankey-diagram1", traces, layout);
  
    const update_color = (points_data) => {
      const new_color = new Int8Array(data.length);
      const selection = [];
      for (let i = 0; i < points_data.points.length; i++) {
        new_color[points_data.points[i].pointNumber] = 1;
        selection.push(points_data.points[i].pointNumber);
      }
      Plotly.restyle("sankey-diagram1", { "line.color": [new_color] }, 1);
    };
  
    sankeyDiagram1.on("plotly_selected", update_color);
    sankeyDiagram1.on("plotly_click", update_color);
  } catch (error) {
    console.error("Error loading data:", error);
  }
};

const createSankey2 = async () => {
  const sankeyDiagram2 = document.getElementById("sankey-diagram2");
  const categoricalDimensionLabels = [
    "Caffeine Intake",
    "Stress Level",
    "Sleep Duration",
  ];

  try {
    const data = await d3.csv("./assets/data/sankey2.csv");
    const caffeineIntake = data.map((row) => row["Caffeine Intake"]);
    const stressLevel = data.map((row) => row["Stress Level"]);
  
    const categoricalDimensions = categoricalDimensionLabels.map((dimLabel) => {
      const values = data.map((row) => row[dimLabel]);
      return {
        values: values,
        label: dimLabel,
      };
    });
  
    const color = new Int8Array(data.length);
    const colorscale = [
      [0, "gray"],
      [1, "firebrick"],
    ];
  
    const layout = {
      width: screen.width * 0.8,
      height: screen.height * 0.7,
      plot_bgcolor: "#fbf7f6",
      paper_bgcolor: "#fbf7f6",
      xaxis: { title: { text: "Caffeine Intake" }, domain: [0, 0.45] },
      yaxis: { title: { text: "Stress Level" }, domain: [0, 0.5] },
      dragmode: "lasso",
      hovermode: "closest",
    };
  
    const traces = [
      {
        type: "scatter",
        x: caffeineIntake,
        y: stressLevel,
        marker: { color: "gray" },
        mode: "markers",
        xaxis: "x", // 指定x轴
        yaxis: "y", // 指定y轴
      },
      {
        type: "parcats",
        domain: { x: [0.55, 1], y: [0, 0.5] }, // 设置Sankey图的domain
        dimensions: categoricalDimensions,
        line: {
          colorscale: colorscale,
          cmin: 0,
          cmax: 1,
          color: color,
          shape: "hspline",
        },
        labelfont: { size: 14 },
        selected: { marker: { color: "firebrick" } },
        unselected: { marker: { opacity: 0.3 } },
      },
    ];
  
    Plotly.newPlot("sankey-diagram2", traces, layout);
  
    const update_color = (points_data) => {
      const new_color = new Int8Array(data.length);
      const selection = [];
      for (let i = 0; i < points_data.points.length; i++) {
        new_color[points_data.points[i].pointNumber] = 1;
        selection.push(points_data.points[i].pointNumber);
      }
      Plotly.restyle("sankey-diagram2", { "line.color": [new_color] }, 1);
    };
  
    sankeyDiagram2.on("plotly_selected", update_color);
    sankeyDiagram2.on("plotly_click", update_color);
  } catch (error) {
    console.error("Error loading data:", error);
  }
};

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
    updateBarChart();
  }

  const pieChart = document.getElementById("pie-chart");
  const pieChartRect = pieChart.getBoundingClientRect();
  if (pieChartRect.top < 400 && !pieChartCreated) {
    pieChartCreated = true;
    createPieChart();
  }
});
