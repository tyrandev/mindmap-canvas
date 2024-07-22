import MindMap from "./mindmap/MindMap.js";
import PdfConverter from "./util/PdfConverter.js";

const mindMap = new MindMap("mindMapCanvas");

const undoButton = document.getElementById("undo-button");
const redoButton = document.getElementById("redo-button");
const saveButton = document.getElementById("save-button");
const loadButton = document.getElementById("import-button");
const exportButton = document.getElementById("export-button");
const pdfButton = document.getElementById("pdf-button");

undoButton.addEventListener("click", handleUndo);
redoButton.addEventListener("click", handleRedo);
saveButton.addEventListener("click", handleSave);
loadButton.addEventListener("click", handleImport);
exportButton.addEventListener("click", handleExport);
pdfButton.addEventListener("click", handlePdfConversion);

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

function handlePdfConversion() {
  const pdfConverter = new PdfConverter();
  pdfConverter.convertDivToPdf();
}
