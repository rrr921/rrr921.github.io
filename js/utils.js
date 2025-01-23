import { sleepData } from "./data.js";

let caffeineInput;
let progressBar;
let controlBar;

export const centerTextPlugin = {
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

export const init = () => {
  caffeineInput = document.getElementById("caf-input");
  progressBar = document.getElementById("progress-bar");
  controlBar = document.getElementById("control-bar");
  caffeineInput.addEventListener("input", updateProgressBar);
};

export const updateProgressBar = () => {
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

const updateImageBorders = (caffeineValue) => {
  const images = document.querySelectorAll(".grid-item");
  let calculatedIndex = Math.floor(caffeineValue / 50) + 1;
  if (caffeineValue === 0) {
    calculatedIndex = 0;
  }
  images.forEach((img, index) => {
    img.style.border = index === calculatedIndex ? "2px solid brown" : "none";
  });
};

export const calculateSleepData = () => {
  const caffeine = parseInt(caffeineInput.value);
  return caffeine / 50 + 1;
};

export const wrapText = (text, maxCharsPerLine) => {
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

export const getBeverageQuantities = () => {
  return {
    coffee: parseInt(document.getElementById("coffee").value) || 0,
    energyDrinks: parseInt(document.getElementById("energyDrinks").value) || 0,
    softDrinks: parseInt(document.getElementById("softDrinks").value) || 0,
  };
};

// 在 DOMContentLoaded 时调用 init
document.addEventListener("DOMContentLoaded", init);
