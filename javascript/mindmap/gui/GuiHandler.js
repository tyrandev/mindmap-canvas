import PdfConverter from "../../util/PdfConverter.js";

export default class GuiHandler {
  constructor(mindMap) {
    this.mindMap = mindMap;
    this.pdfConverter = new PdfConverter();
    this.initEventListeners();
  }

  initEventListeners() {
    document
      .getElementById("undo-button")
      .addEventListener("click", this.handleUndo.bind(this));
    document
      .getElementById("redo-button")
      .addEventListener("click", this.handleRedo.bind(this));
    document
      .getElementById("save-button")
      .addEventListener("click", this.handleSave.bind(this));
    document
      .getElementById("import-button")
      .addEventListener("click", this.handleImport.bind(this));
    document
      .getElementById("export-button")
      .addEventListener("click", this.handleExport.bind(this));
    document
      .getElementById("pdf-button")
      .addEventListener("click", this.handlePdfConversion.bind(this));
  }

  handleUndo() {
    this.mindMap.circleController.undo();
  }

  handleRedo() {
    this.mindMap.circleController.redo();
  }

  handleSave() {
    this.mindMap.fileHandler.saveToLocalStorage();
  }

  handleImport() {
    this.mindMap.fileInput.click();
  }

  handleExport() {
    this.mindMap.fileHandler.exportToJson();
  }

  handlePdfConversion() {
    this.pdfConverter.convertDivToPdf();
  }
}
