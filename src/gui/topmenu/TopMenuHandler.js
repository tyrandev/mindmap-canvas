import PdfConverter from "../../util/converter/PdfConverter.js";
import ImgConverter from "../../util/converter/ImgConverter.js";
import NodeOutlineText from "../../model/geometric/node/helper/NodeOutlineText.js";

export default class TopMenuHandler {
  constructor(mindMap) {
    this.mindMap = mindMap;
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
    document
      .getElementById("image-button")
      .addEventListener("click", this.handleImgConversion.bind(this));
    document
      .getElementById("text-button")
      .addEventListener("click", this.handleTextConversion.bind(this));
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
    PdfConverter.convertDivToPdf();
  }

  handleImgConversion() {
    ImgConverter.convertDivToImage();
  }

  handleTextConversion() {
    NodeOutlineText.downloadTextOutline(
      this.mindMap.circleController.getMotherCircle()
    );
  }
}
