// 进度条部分从这里开始
const cafInput = document.getElementById("cafInput");
const progressBar = document.getElementById("progressBar");
const progressContainer = document.getElementById("progressContainer");
const controlBar = document.getElementById("controlBar");

function updateImageBorders() {
  const images = document.querySelectorAll('.grid-item');
  const caffeineValue = parseInt(cafInput.value);
  const calculatedIndex = Math.floor(caffeineValue / 50);

  images.forEach((img, index) => {
      if (index === calculatedIndex) {
          img.style.border = "2px solid brown";
      } else {
          img.style.border = "none";
      }
  });
}

function updateProgressBar() {
  const inputValue = Math.min(Math.max(cafInput.value, 0), 400);
  progressBar.style.width = inputValue + "px";
  const points = document.querySelectorAll(".point");
  points.forEach((point) => point.remove());
  const numPoints = 8;
  for (let i = 0; i <= numPoints; i++) {
    const point = document.createElement("div");
    point.classList.add("point");
    point.style.left = i * 50 + "px";
    if (i * 50 <= inputValue) {
      point.style.backgroundColor = "#53030e";
    } else {
      point.style.backgroundColor = "#e8d6cc";
    }
    controlBar.appendChild(point);
  }
  updateImageBorders();
}
// 先初始渲染，然后再监听
window.onload = function () {
  updateProgressBar();
  drawBubbleChart();
};
cafInput.addEventListener("input", updateProgressBar);
// 进度条部分到此为止

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

function drawBubbleChart() {
  const svg = d3.select("#bubbleChart");
  const width = 1300;
  const height = 450;

  svg.attr("width", width).attr("height", height);

  const beverageQuantities = {
    coffee: parseInt(document.getElementById("coffee").value) || 0,
    energyDrinks: parseInt(document.getElementById("energyDrinks").value) || 0,
    softDrinks: parseInt(document.getElementById("softDrinks").value) || 0,
  };

  const bubbles = drinksData.map((drink) => {
    const size = drink.caffeine * 1.5;
    const color = categoryColors[drink.type];

    return {
      text: drink.name,
      size: size,
      caffeine: drink.caffeine,
      color: color,
      type: drink.type,
    };
  });

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

    function ticked() {
      const bubble = svg.selectAll("circle")
        .data(bubbles)
        .join("circle")
        .attr("r", d => d.size)
        .attr("fill", d => {
          // 突出显示当前类别的气泡
          if ((d.type === "coffee" && beverageQuantities.coffee > 0) ||
            (d.type === "energyDrinks" && beverageQuantities.energyDrinks > 0) ||
            (d.type === "softDrinks" && beverageQuantities.softDrinks > 0)) {
            return d.color;
          }
          return 'gray';
        })
        .attr("opacity", 0.8)
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .on("mouseover", (event, d) => {
          const labelText = `${d.text}: ${d.caffeine} mg/100ml`;

          const textElement = svg.append("text")
            .attr("class", "bubble-label")
            .attr("x", d.x)
            .attr("y", d.y - (d.size * 0.2))
            .attr("text-anchor", "middle")
            .attr("fill", "white")
            .attr("font-size", '20px')
            .text(labelText);
          const bbox = textElement.node().getBBox();
          svg.append("rect")
            .attr("class", "bubble-label-bg")
            .attr("x", bbox.x - 5)
            .attr("y", bbox.y - 5)
            .attr("width", bbox.width + 10)
            .attr("height", bbox.height + 10)
            .attr("fill", "#824a4a")
            .attr("opacity", 0.95)
            .attr("border-radius",100)
            .attr("rx", 10)
            textElement.raise();
        })
        .on("mouseout", () => {
          svg.selectAll(".bubble-label").remove();
          svg.selectAll(".bubble-label-bg").remove();
        });
  
      // 更新气泡位置
      bubble.attr("cx", d => d.x)
        .attr("cy", d => d.y);
  
      // 添加饮料名称
      const text = svg.selectAll("text")
        .data(bubbles)
        .join("text")
        .attr("text-anchor", "middle") // 设置文本居中
        .attr("fill", "white")
        .attr("x", d => d.x) // 设置文本的 x 坐标为气泡的 x 坐标
        .attr("y", d => d.y - (d.size * 0.15)) // 向上移动文本
        .attr("font-size", d => `${d.size * 0.27}px`); // 根据气泡大小设置字体大小
        text.selectAll("tspan")
        .data(d => {
          const maxCharsPerLine = 10; // 每行最大字符数
          const words = d.text.split(" ");
          let lines = [];
          let currentLine = "";
    
          words.forEach(word => {
            // 检查当前行加上新单词是否超过最大字符数
            if ((currentLine + word).length > maxCharsPerLine) {
              if (currentLine) { // 只有当前行非空时才推入
                lines.push(currentLine.trim());
              }
              currentLine = word + " "; // 开始新行
            } else {
              currentLine += word + " ";
            }
          });
    
          // 添加最后一行，确保不添加空行
          if (currentLine.trim()) {
            lines.push(currentLine.trim());
          }
    
          return lines;
        })
        .join("tspan")
        .text(d => d)
        .attr("x", (d, i, nodes) => {
          const parentX = nodes[i].parentNode.getAttribute("x"); // 获取父元素的 x 坐标
          return parentX; // 设置每行的 x 坐标为父元素的 x 坐标
        })
        .attr("dy", (d, i) => `${i > 0 ? 1 : 0}em`) // 设置行间距，第一行不加间距
        .attr("font-size", d => `${d.size * 0.1}px`); // 根据气泡大小设置字体大小
    }
}

document.getElementById("coffee").addEventListener("input", drawBubbleChart);
document
  .getElementById("energyDrinks")
  .addEventListener("input", drawBubbleChart);
document
  .getElementById("softDrinks")
  .addEventListener("input", drawBubbleChart);

// 这两个变量用于控制chart2和chart3只创建一次
let chart2Created = false;
let chart3Created = false;
const invertedSleepDuration = averageSleepDuration.map(
  (duration) => Math.max(...averageSleepDuration) - duration
);

let caffeineValue = 0;
let totalCaffeine = 0;

//Chart.register(ChartDataLabels);

// 创建第一个图表
function createChart1(chartId, data) {
  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Average Sleep Duration vs Caffeine Intake",
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
}

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

const sleepDurationChart = createChart1("combinedChart", chartData1);

function updateChart1() {
  const caffeine = parseInt(document.getElementById("cafInput").value);
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
}

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
    document.getElementById("cafInput").value = totalCaffeine;
    updateProgressBar();
  });
});

// 第一个图表到此为止，仍然需要修改散点
/*const averageSleepDuration = [
  7.4888, 7.5176, 7.3586, 7.3743, 7.4942, 7.4967, 8.0532, 7.7307,
];*/
const sleepData = [
  { sleepScore: 9.90, effectiveSleep: 7.4, totalSleep: 7.47, movement: 1.85 },//default
  { sleepScore: 7.88, effectiveSleep: 5.9, totalSleep: 7.49, movement: 2.04 },
  { sleepScore: 3.46, effectiveSleep: 2.6, totalSleep: 7.52, movement: 2.01 },
  { sleepScore: 1.22, effectiveSleep: 0.9, totalSleep: 7.36, movement: 2.03 },
  { sleepScore: 0.95, effectiveSleep: 0.7, totalSleep: 7.37, movement: 2.0 },
  { sleepScore: 0.93, effectiveSleep: 0.7, totalSleep: 7.49, movement: 2.03 },
  { sleepScore: 0.93, effectiveSleep: 0.7, totalSleep: 7.5, movement: 2.08 },
  { sleepScore: 0.87, effectiveSleep: 0.7, totalSleep: 8.05, movement: 1.9 },
  { sleepScore: 0.91, effectiveSleep: 0.7, totalSleep: 7.73, movement: 1.6 },
];
// 这里是这样的，因为只有八组数据，在上面定义了数组，直接除以范围50，得到0-7就是数据index
function calculateSleepData() {
  const caffeine = parseInt(document.getElementById("cafInput").value);
  return caffeine / 50 + 1;
}

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

// 创建图表的函数
function createChart2() {
  const idx = Math.floor(calculateSleepData()) || 0;
  console.log("Creating Chart 2 with index:", idx);
  console.log("Sleep Data:", sleepData[idx]);
  const ctx = document.getElementById("sleepScoreChart").getContext("2d");
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
        position: "top",
      },
      title: {
        display: true,
        text: "Sleep quality",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
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
}

// 更新图表的函数
function updateChart2() {
  const idx = Math.floor(calculateSleepData());
  const chart = Chart.getChart("sleepScoreChart");

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
}

// 监听输入变化
document.querySelectorAll(".quantity").forEach((input) => {
  input.addEventListener("input", () => {
    updateChart2();
  });
});

// chart2到此结束

async function createChart3() {
  var gd = document.getElementById("sankeyDiagram1");
  var categoricalDimensionLabels = [
    "Study Hours",
    "Caffeine Intake",
    "Screen Time",
    "Sleep Duration",
  ];

  const data = await d3.csv("../output_file1.csv");
  var caffeineIntake = data.map(function (row) {
    return row["Caffeine Intake"];
  });
  var screenTime = data.map(function (row) {
    return row["Screen Time"];
  });

  var categoricalDimensions = categoricalDimensionLabels.map(function (
    dimLabel
  ) {
    var values = data.map(function (row) {
      return row[dimLabel];
    });

    return {
      values: values,
      label: dimLabel,
    };
  });

  var color = new Int8Array(data.length);
  var colorscale = [
    [0, "gray"],
    [1, "firebrick"],
  ];

  var layout = {
    width: 1200,
    height: 600,
    plot_bgcolor: "#fbf7f6",
    paper_bgcolor: "#fbf7f6",
    xaxis: { title: { text: "Caffeine Intake" }, domain: [0, 0.45] },
    yaxis: { title: { text: "Study Hours" }, domain: [0, 0.5] },
    dragmode: "lasso",
    hovermode: "closest",
    title: {
      text: "Try to interact with the diagrams below!",
      font: {
        size: 20
      },
      x: 0.5,
      xanchor: 'center'
    }
  };

  var traces = [
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

  Plotly.newPlot("sankeyDiagram1", traces, layout);

  var update_color = function (points_data) {
    var new_color = new Int8Array(data.length);
    var selection = [];
    for (var i = 0; i < points_data.points.length; i++) {
      new_color[points_data.points[i].pointNumber] = 1;
      selection.push(points_data.points[i].pointNumber);
    }
    Plotly.restyle("sankeyDiagram1", { "line.color": [new_color] }, 1);
  };

  gd.on("plotly_selected", update_color);
  gd.on("plotly_click", update_color);
}

async function createChart4() {
  var gd = document.getElementById("sankeyDiagram2");
  var categoricalDimensionLabels = [
    "Caffeine_Intake",
    "Stress_Level",
    "Sleep_Duration",
    "Light_Exposure",
  ];

  const data = await d3.csv("../output_file2.csv");
  var caffeineIntake = data.map(function (row) {
    return row["Caffeine_Intake"];
  });
  var stressLevel = data.map(function (row) {
    return row["Stress_Level"];
  });

  var categoricalDimensions = categoricalDimensionLabels.map(function (
    dimLabel
  ) {
    var values = data.map(function (row) {
      return row[dimLabel];
    });

    return {
      values: values,
      label: dimLabel,
    };
  });

  var color = new Int8Array(data.length);
  var colorscale = [
    [0, "gray"],
    [1, "firebrick"],
  ];

  var layout = {
    width: 1200,
    height: 600,
    plot_bgcolor: "#fbf7f6",
    paper_bgcolor: "#fbf7f6",
    xaxis: { title: { text: "Caffeine Intake" }, domain: [0, 0.45] },
    yaxis: { title: { text: "Study Hours" }, domain: [0, 0.5] },
    dragmode: "lasso",
    hovermode: "closest",
  };

  var traces = [
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

  Plotly.newPlot("sankeyDiagram2", traces, layout);

  var update_color = function (points_data) {
    var new_color = new Int8Array(data.length);
    var selection = [];
    for (var i = 0; i < points_data.points.length; i++) {
      new_color[points_data.points[i].pointNumber] = 1;
      selection.push(points_data.points[i].pointNumber);
    }
    Plotly.restyle("sankeyDiagram2", { "line.color": [new_color] }, 1);
  };

  gd.on("plotly_selected", update_color);
  gd.on("plotly_click", update_color);
}

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

  const wordBubble = document.getElementById("bubbleChart");
  const bubbleRect = wordBubble.getBoundingClientRect();
  if (bubbleRect.top < 270 && !bubbleUpdated) {
    bubbleUpdated = true;
    drawBubbleChart();
  }
  const chart1 = document.getElementById("combinedChart");
  const chartRect1 = chart1.getBoundingClientRect();
  console.log(chartRect1.top)
  if (chartRect1.top < 330) {
    updateChart1();
    createChart3();
    createChart4();
  }

  const chart2 = document.getElementById("sleepScoreChart");
  const chartRect2 = chart2.getBoundingClientRect();
  console.log(chartRect2.top)
  if (chartRect2.top < 240 && !chart2Created) {
    chart2Created = true;
    createChart2();
  }
});
