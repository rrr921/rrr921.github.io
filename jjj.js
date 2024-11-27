function updateBubbleChart() {
    const svg = d3.select("#bubbleChart");
    const width = 1300; // 增加宽度
    const height = 450; // 高度保持不变
  
    svg.attr("width", width).attr("height", height); // 设置新的宽度和高度
  
    svg.selectAll("*").remove(); // 清空之前的图形
  
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
      ) // 增加 x 轴的力强度
      .force(
        "y",
        d3
          .forceY()
          .strength(0.8)
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
            return d.color; // 突出显示
          }
          return d3.rgb(d.color).darker(2); // 变暗程度加大
        })
        .attr("opacity", 0.8)
        .attr("cx", width / 2)
        .attr("cy", height / 2);
  
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
        .attr("y", d => d.y) // 设置文本的 y 坐标为气泡的 y 坐标
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
        .attr("font-size", "10px");
    }
  }