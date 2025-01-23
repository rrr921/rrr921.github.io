export const createSankey1 = async () => {
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

export const createSankey2 = async () => {
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
