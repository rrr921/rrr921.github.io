// 进度条部分从这里开始
const cafInput = document.getElementById("cafInput");
const progressBar = document.getElementById("progressBar");
const progressContainer = document.getElementById("progressContainer");
const controlBar = document.getElementById("controlBar");
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
}
// 先初始渲染，然后再监听
window.onload = function () {
  updateProgressBar();
  drawWordCloud();
};
cafInput.addEventListener("input", updateProgressBar);
// 进度条部分到此为止

const caffeineIntakeLabels = [0, 50, 100, 150, 200, 250, 300, 350, 400];
const averageSleepDuration = [
  7.4888 - 7.4712, 7.5176 - 7.4712, 7.3586 - 7.4712, 7.3743 - 7.4712, 7.4942 - 7.4712, 7.4967 - 7.4712, 8.0532 - 7.4712, 7.7307 - 7.4712,
];

// 词云图
const drinksData = [
  { name: "Nescafe Gold", caffeine: 26.37976039, type: "coffee" },
  {
    name: "Starbucks Doubleshot Espresso",
    caffeine: 62.4295047,
    type: "coffee",
  },
  { name: "McDonalds Iced Coffee", caffeine: 39.10669143, type: "coffee" },
  { name: "7 Eleven Brewed Coffee", caffeine: 59.17459888, type: "coffee" },
  { name: "McDonalds (McCafe) Latte", caffeine: 30.00997515, type: "coffee" },
  { name: "McDonalds (McCafe) Mocha", caffeine: 35.29342148, type: "coffee" },
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

/*function showBeverage() {
  const coffeeList = document.getElementById('coffeeDisplay');
  const energyDrinksList = document.getElementById('energyDrinksDisplay');
  const softDrinksList = document.getElementById('softDrinksDisplay');

  drinksData.forEach(drink => {
      const drinkElement = document.createElement('div');
      drinkElement.className = 'beverage';
      drinkElement.innerText = drink.name;
      drinkElement.style.backgroundColor = getColor(drink);

      if (drink.type === "coffee") {
          coffeeList.appendChild(drinkElement);
      } else if (drink.type === "energyDrinks") {
          energyDrinksList.appendChild(drinkElement);
      } else if (drink.type === "softDrinks") {
          softDrinksList.appendChild(drinkElement);
      }
  });
}*/


function getColor(drink) {
  const minCaffeine = 5.283446329;
  const maxCaffeine = 65.51473448;
  const normalizedValue =1-
    (drink.caffeine - minCaffeine) / (maxCaffeine - minCaffeine);

  const clampedValue = Math.max(0, Math.min(1, normalizedValue));
  const colorDepth = Math.floor(clampedValue * 127);

  let baseColor = `rgba(139, 69, 19, 1)`;
  let baseFont = `'Righteous', sans-serif`;
  // Courgette, new roman
  // font-family: 'Muli', sans-serif;

  const rgbaValues = baseColor.match(/\d+/g);
  return `rgba(${Math.min(
    parseInt(rgbaValues[0]) + colorDepth,
    255
  )}, ${Math.min(parseInt(rgbaValues[1]) + colorDepth, 255)}, ${Math.min(
    parseInt(rgbaValues[2]) + colorDepth,
    255
  )}, 0.9)`;
}



function drawWordCloud() {
  const svg = d3.select("#wordCloud");
  const width = +svg.attr("width");
  const height = +svg.attr("height");

  svg.selectAll("*").remove();

  // 创建初始单词数组，并为每个单词添加字体属性
  const initialWords = drinksData.map((drink) => ({
    text: drink.name,
    size: Math.floor(Math.random() * 5) + 9,
    color: "gray",
  }));
  const layout = d3.layout
    .cloud()
    .size([width, height])
    .words(initialWords)
    .padding(5)
    .rotate(() => ~~(Math.random() * 2) * 0)
    .fontSize((d) => d.size)
    .on("end", draw);

  layout.start();

  function draw(words) {
    const group = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const text = group
      .selectAll("text")
      .data(words)
      .enter()
      .append("text")
      .style("font-size", (d) => `${d.size}px`)
      .style("fill", (d) => d.color)
      .attr("text-anchor", "middle")
      .attr("transform", (d) => `translate(0, 0)`)
      .text((d) => d.text)
      .attr("opacity", 0);

    text
      .transition()
      .duration(1000)
      .attr("transform", (d) => `translate(${d.x},${d.y})rotate(${d.rotate})`)
      .attr("opacity", 1);
  }
}

function updateWordCloud() {
  const svg = d3.select("#wordCloud");
  const width = +svg.attr("width");
  const height = +svg.attr("height");

  svg.selectAll("*").remove();

  const beverageQuantities = {
    coffee: parseInt(document.getElementById("coffee").value) || 0,
    energyDrinks: parseInt(document.getElementById("energyDrinks").value) || 0,
    softDrinks: parseInt(document.getElementById("softDrinks").value) || 0,
  };

  const words = drinksData.map((drink) => {
    let size = Math.floor(Math.random() * 5) + 9;
    let color = "gray";

    if (beverageQuantities.coffee > 0 && drink.type === "coffee") {
      size = Math.max(20, beverageQuantities.coffee * 5);
      color = getColor(drink);
    }

    if (beverageQuantities.energyDrinks > 0 && drink.type === "energyDrinks") {
      size = Math.max(20, beverageQuantities.energyDrinks * 5);
      color = getColor(drink);
    }

    if (beverageQuantities.softDrinks > 0 && drink.type === "softDrinks") {
      size = Math.max(20, beverageQuantities.softDrinks * 5);
      color = getColor(drink);
    }

    return {
      text: drink.name,
      size: size,
      color: color,
    };
  });

  const layout = d3.layout
    .cloud()
    .size([width, height])
    .words(words)
    .padding(5)
    .rotate(() => ~~(Math.random() * 2) * 0)
    .fontSize((d) => d.size)
    .on("end", draw);

  layout.start();

  function draw(words) {
    const group = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const text = group
      .selectAll("text")
      .data(words)
      .enter()
      .append("text")
      .style("font-size", (d) => `${d.size}px`)
      .style("fill", (d) => d.color)
      .attr("text-anchor", "middle")
      .attr("transform", (d) => `translate(${d.x},${d.y})rotate(${d.rotate})`)
      .text((d) => d.text)
      .attr("opacity", 0)
      .transition()
      .duration(750)
      .attr("opacity", 1);
  }
}

// 这两个变量用于控制chart2和chart3只创建一次
let chart2Created = false;
let chart3Created = false;
const invertedSleepDuration = averageSleepDuration.map(
  (duration) => Math.max(...averageSleepDuration) - duration
);

let caffeineValue = 0;
let totalCaffeine = 0;

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
    },
    scales: {
      x: {
        title: { display: true, text: "Caffeine Intake (mg)" },
        ticks: { autoSkip: false, labelOffset: -40 },
        grid: { drawOnChartArea: false },
      },
      y: {
        title: { display: true, text: "Average Sleep Duration (hours)" },
        
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
  coffee: 34,
  cola: 30,
  redBull: 80,
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
  //{ sleepScore: 9.90, effectiveSleep: 7.4, totalSleep: 7.47, movement: 1.85 },//default
  { sleepScore: 7.88, effectiveSleep: 5.9, totalSleep: 7.49, movement: 2.04 },
  { sleepScore: 3.46, effectiveSleep: 2.6, totalSleep: 7.52, movement: 2.01 },
  { sleepScore: 1.22, effectiveSleep: 0.9, totalSleep: 7.36, movement: 2.03 },
  { sleepScore: 0.95, effectiveSleep: 0.7, totalSleep: 7.37, movement: 2.00 },
  { sleepScore: 0.93, effectiveSleep: 0.7, totalSleep: 7.49, movement: 2.03 },
  { sleepScore: 0.93, effectiveSleep: 0.7, totalSleep: 7.50, movement: 2.08 },
  { sleepScore: 0.87, effectiveSleep: 0.7, totalSleep: 8.05, movement: 1.9 },
  { sleepScore: 0.91, effectiveSleep: 0.7, totalSleep: 7.73, movement: 1.6 },
];
// 这里是这样的，因为只有八组数据，在上面定义了数组，直接除以范围50，得到0-7就是数据index
function calculateSleepData() {
  const caffeine = parseInt(document.getElementById("cafInput").value);
  return caffeine / 50;
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
    const idx = Math.floor(calculateSleepData());
    const text = sleepData[idx].sleepScore;
    const textX = Math.round((width - ctx.measureText(text).width) / 2);
    const textY = height / 2 + 45;
    ctx.fillText(text, textX, textY);
    ctx.save();
  },
};

// 创建图表的函数
function createChart2() {
  const idx = Math.floor(calculateSleepData());

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
        text: "Sleep score/quality",
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
    updateWordCloud();
    updateChart2();
  });
});

// chart2到此结束

// 这里是图表三，从本地csv读，有跨域问题，所以要么用python服务器，要么live server才能正常运行显示
async function createChart3() {
  const caffeine = parseInt(document.getElementById("cafInput").value);

  try {
    const rows = await d3.csv("../resources/sleep.csv"); // Use await to load the CSV

    function unpack(rows, key) {
      return rows.map(function (row) {
        return row[key];
      });
    }

    // 保留所有数据
    const allCaffeineValues = unpack(rows, "Caffeine_Intake_mg");

    // 根据输入的caffeine值设置颜色
    const colors = rows.map((row) => {
      const intake = parseInt(row.Caffeine_Intake_mg);
      if (intake >= caffeine - 20 && intake <= caffeine + 20) {
        return row.Stress_Level;
      } else {
        return 0;
      }
    });

    var data = [
      {
        type: "parcoords",
        line: {
          showscale: true,
          reversescale: false,
          colorscale: [
            [0, "gray"],
            [0.5, "yellow"],
            [1, "red"],
          ],
          cmin: 0,
          cmax: 10,
          color: colors,
        },
        dimensions: [
          {
            range: [0, 400],
            label: "Caffeine Intake (mg)",
            values: allCaffeineValues,
          },
          {
            range: [0, 10],
            label: "Stress Level",
            values: unpack(rows, "Stress_Level"),
          },
          {
            range: [0, 10],
            label: "Sleep Duration (hours)",
            values: unpack(rows, "Sleep_Duration_Hours"),
          },
        ],
      },
    ];

    var layout = {
      title: "Parallel Coordinates Plot",
      paper_bgcolor: "rgba(251,247,246,1)",
      plot_bgcolor: "rgba(251,247,246,1)",
    };

    Plotly.newPlot("stressLevel", data, layout);
    console.log("success");
  } catch (err) {
    console.error("Error loading the CSV file:", err);
  }
}
// 图表三到此结束


/*async function createChart4() {
  var gd = document.getElementById("sankeyDiagram");
  var categoricalDimensionLabels = [
    'Study Hours',
    'Caffeine Intake',
    'Screen Time',
    'Sleep Duration'
  ];

  // Use await to read the CSV file
  const data = await d3.csv("../output_file1.csv");

  // Preprocess Data
  console.log(data);
  var caffeineIntake = data.map(function(row) { return row['Caffeine_Intake']; });
  console.log(caffeineIntake)
  var studyHours = data.map(function(row) { return row['Study_Hours']; });

  var categoricalDimensions = categoricalDimensionLabels.map(
    function(dimLabel) {
      // Extract column
      var values = data.map(function(row) {
        return row[dimLabel];
      });

      return {
        values: values,
        label: dimLabel
      };
    });

  // Colors
  var color = new Int8Array(data.length);
  var colorscale = [[0, 'gray'], [1, 'firebrick']];

  // Layout
  var layout = {
    width: 600,
    height: 800,
    xaxis: { title: { text: 'Caffeine Intake' } },
    yaxis: { domain: [0.6, 1], title: { text: 'Study Hours' } },
    dragmode: 'lasso',
    hovermode: 'closest'
  };

  // Build Traces
  var traces = [
    {
      type: 'scatter',
      x: caffeineIntake,
      y: studyHours,
      marker: { color: 'gray' },
      mode: 'markers',
      selected: { 'marker': { 'color': 'firebrick' } },
      unselected: { 'marker': { 'opacity': 0.3 } }
    },
    {
      type: 'parcats',
      domain: { y: [0, 0.4] },
      dimensions: categoricalDimensions,
      line: {
        colorscale: colorscale,
        cmin: 0,
        cmax: 1,
        color: color,
        shape: 'hspline'
      },
      labelfont: { size: 14 }
    }
  ];

  // Make plot
  Plotly.newPlot('sankeyDiagram', traces, layout);

  // Update color on selection and click
  var update_color = function(points_data) {
    var new_color = new Int8Array(data.length);
    var selection = [];
    for (var i = 0; i < points_data.points.length; i++) {
      new_color[points_data.points[i].pointNumber] = 1;
      selection.push(points_data.points[i].pointNumber);
    }

    // Update color of selected paths in parallel categories diagram
    Plotly.restyle('sankeyDiagram', { 'line.color': [new_color] }, 1);
  };

  gd.on('plotly_selected', update_color);
  gd.on('plotly_click', update_color);
}*/

async function createChart5() {
  var gd = document.getElementById("sankeyDiagram2");
  var categoricalDimensionLabels = [
    'Caffeine_Intake',
    'Stress_Level',
    'Sleep_Duration',
    'Light_Exposure'
  ];

  // Use await to read the CSV file
  const data = await d3.csv("../output_file2.csv");

  // Preprocess Data
  console.log(data);
  var caffeineIntake = data.map(function(row) { return row['Caffeine_Intake']; });
  console.log(caffeineIntake)
  var studyHours = data.map(function(row) { return row['Stress_Level']; });

  var categoricalDimensions = categoricalDimensionLabels.map(
    function(dimLabel) {
      // Extract column
      var values = data.map(function(row) {
        return row[dimLabel];
      });

      return {
        values: values,
        label: dimLabel
      };
    });

  // Colors
  var color = new Int8Array(data.length);
  var colorscale = [[0, 'gray'], [1, 'firebrick']];

  // Layout
  var layout = {
    width: 600,
    height: 800,
    xaxis: { title: { text: 'Caffeine Intake' } },
    yaxis: { domain: [0.6, 1], title: { text: 'Study Hours' } },
    dragmode: 'lasso',
    hovermode: 'closest'
  };

  // Build Traces
  var traces = [
    {
      type: 'scatter',
      x: caffeineIntake,
      y: studyHours,
      marker: { color: 'gray' },
      mode: 'markers',
      selected: { 'marker': { 'color': 'firebrick' } },
      unselected: { 'marker': { 'opacity': 0.3 } }
    },
    {
      type: 'parcats',
      domain: { y: [0, 0.4] },
      dimensions: categoricalDimensions,
      line: {
        colorscale: colorscale,
        cmin: 0,
        cmax: 1,
        color: color,
        shape: 'hspline'
      },
      labelfont: { size: 14 }
    }
  ];

  // Make plot
  Plotly.newPlot('sankeyDiagram2', traces, layout);

  // Update color on selection and click
  var update_color = function(points_data) {
    var new_color = new Int8Array(data.length);
    var selection = [];
    for (var i = 0; i < points_data.points.length; i++) {
      new_color[points_data.points[i].pointNumber] = 1;
      selection.push(points_data.points[i].pointNumber);
    }

    // Update color of selected paths in parallel categories diagram
    Plotly.restyle('sankeyDiagram2', { 'line.color': [new_color] }, 1);
  };

  gd.on('plotly_selected', update_color);
  gd.on('plotly_click', update_color);
}

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

  const chart1 = document.getElementById("combinedChart");
  const chartRect1 = chart1.getBoundingClientRect();
  //console.log(chartRect1.top)
  if (chartRect1.top < 280) {
    updateChart1();
    //createChart4();
    createChart5();
  }

  const chart2 = document.getElementById("sleepScoreChart");
  const chartRect2 = chart2.getBoundingClientRect();
  if (chartRect2.top < 377 && !chart2Created) {
    chart2Created = true;
    createChart2();
    
  }

  const chart3 = document.getElementById("stressLevel");
  const chartRect3 = chart3.getBoundingClientRect();
  //console.log(chartRect3.top);
  if (chartRect3.top < 444 && !chart3Created) {
    chart3Created = true;
    const chartSection = document.querySelector(".chart-section3");
    chartSection.classList.add("visible");
    createChart3();
  }
});
