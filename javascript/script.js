import MindMap from "./mindmap/MindMap.js";

const mindMap = new MindMap("mindMapCanvas");

// Get button elements by their IDs
const undoButton = document.getElementById("undo-button");
const redoButton = document.getElementById("redo-button");
const saveButton = document.getElementById("save-button");
const loadButton = document.getElementById("import-button");
const exportButton = document.getElementById("export-button");
const colorButton = document.getElementById("color-button");
const resizeButton = document.getElementById("resize-button");

// Add event listeners to each button
undoButton.addEventListener("click", handleUndo);
redoButton.addEventListener("click", handleRedo);
saveButton.addEventListener("click", handleSave);
loadButton.addEventListener("click", handleImport);
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
  mindMap.fileHandler.saveToLocalStorage();
}

function handleImport() {
  mindMap.fileInput.click();
}

function handleExport() {
  mindMap.fileHandler.exportToJson();
}
