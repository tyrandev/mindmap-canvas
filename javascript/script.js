import MindMap from "./mindmap/MindMap.js";
import CircleSerializer from "./circle/helper/CircleSerializer.js";

const mindMap = new MindMap("mindMapCanvas");

// Get button elements by their IDs
const undoButton = document.getElementById("undo-button");
const redoButton = document.getElementById("redo-button");
const saveButton = document.getElementById("save-button");
const loadButton = document.getElementById("load-button");
const exportButton = document.getElementById("export-button");
const colorButton = document.getElementById("color-button");
const resizeButton = document.getElementById("resize-button");

// Add event listeners to each button
undoButton.addEventListener("click", handleUndo);
redoButton.addEventListener("click", handleRedo);
saveButton.addEventListener("click", handleSave);
loadButton.addEventListener("click", handleLoad);
exportButton.addEventListener("click", handleExport);
colorButton.addEventListener("click", handleColor);
resizeButton.addEventListener("click", handleResize);

// Define the button click handler functions
function handleUndo() {
  mindMap.circleController.undo();
}

function handleRedo() {
  mindMap.circleController.redo();
}

function handleSave() {
  const filename = prompt("Enter the name to save the mind map:");
  if (filename) {
    const rootCircle = mindMap.circleController.getMotherCircle();
    const json = CircleSerializer.serialize(rootCircle);
    mindMap.fileHandler.saveToLocalStorage(filename, json);
  }
}

function handleLoad() {
  mindMap.fileInput.click();
}

function handleExport() {
  const filename = prompt("Enter the name to export the mind map:");
  if (filename) {
    mindMap.fileHandler.exportToJson(filename);

    const rootCircle = mindMap.circleController.getMotherCircle();
    const json = CircleSerializer.serialize(rootCircle);
    mindMap.fileHandler.saveToLocalStorage(filename, json);
  }
}

function handleColor() {
  //   const color = prompt('Enter a color for the circles (e.g., #ff0000):');
  //   if (color) {
  //     mindMap.circleController.setColor(color);  // Assuming `setColor` method exists in CircleController
  //   }
}

function handleResize() {
  //   const width = prompt('Enter the new width for the canvas:');
  //   const height = prompt('Enter the new height for the canvas:');
  //   if (width && height) {
  //     mindMap.canvas.width = parseInt(width, 10);
  //     mindMap.canvas.height = parseInt(height, 10);
  //     mindMap.context.clearRect(0, 0, mindMap.canvas.width, mindMap.canvas.height);
  //     mindMap.circleController.render();  // Assuming `render` method exists in CircleController
  //   }
}
