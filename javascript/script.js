import MindMap from "./mindmap/MindMap.js";

const mindMap = new MindMap("mindMapCanvas");

const undoButton = document.getElementById("undo-button");
const redoButton = document.getElementById("redo-button");
const saveButton = document.getElementById("save-button");
const loadButton = document.getElementById("import-button");
const exportButton = document.getElementById("export-button");

undoButton.addEventListener("click", handleUndo);
redoButton.addEventListener("click", handleRedo);
saveButton.addEventListener("click", handleSave);
loadButton.addEventListener("click", handleImport);
exportButton.addEventListener("click", handleExport);

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
