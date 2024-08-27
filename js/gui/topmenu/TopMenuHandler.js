import PdfConverter from "../../util/converter/media/PdfConverter.js";
import ImgConverter from "../../util/converter/media/ImgConverter.js";
import NodeOutlineText from "../../util/converter/text/NodeOutlineText.js";
import FileInputManager from "../../util/file/FileInputManager.js";
import MouseModeManager from "../../input/mouse/MouseModeManager.js";
import * as MouseConstants from "../../constants/MouseConstants.js";
import JsonExporter from "../../data/serialization/JsonExporter.js";
import JsonImporter from "../../data/serialization/JsonImporter.js";

export default class TopMenuHandler {
  constructor(systemCore) {
    this.systemCore = systemCore;
    this.nodeController = this.systemCore.nodeController;
    this.modeManager = MouseModeManager;
    this.jsonExporter = new JsonExporter(this.nodeController);
    this.JsonImporter = new JsonImporter(this.nodeController);
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
    document
      .getElementById("color-button")
      .addEventListener("click", this.handleColorMode.bind(this));
    document
      .getElementById("resize-button")
      .addEventListener("click", this.handleResizeMode.bind(this));
    document
      .getElementById("rename-button")
      .addEventListener("click", this.handleRenameMode.bind(this));
    document
      .getElementById("delete-node-button")
      .addEventListener("click", this.handleDeleteMode.bind(this));
    document
      .getElementById("normal-cursor-mode")
      .addEventListener("click", this.handleNormalMode.bind(this));
    document
      .getElementById("copy-color-button")
      .addEventListener("click", this.handleCopyColorMode.bind(this));
  }

  handleUndo() {
    this.nodeController.undo();
  }

  handleRedo() {
    this.nodeController.redo();
  }

  handleSave() {
    this.systemCore.mindmapLocalStorage.saveToLocalStorage();
  }

  handleImport() {
    const fileInput = FileInputManager.getFileInput();
    if (!fileInput) {
      console.error("File input element not found");
      return;
    }
    fileInput.addEventListener("change", this.handleFileInputChange.bind(this));
    fileInput.click();
  }

  handleFileInputChange(event) {
    const file = event.target.files[0];
    if (file) {
      FileInputManager.importFromFile(file)
        .then(() => console.log("Import successful"))
        .catch((error) => console.error("Import failed", error));
    }
  }

  handleExport() {
    this.jsonExporter.exportToJson();
  }

  handlePdfConversion() {
    PdfConverter.convertDivToPdf();
  }

  handleImgConversion() {
    ImgConverter.convertDivToImage();
  }

  handleTextConversion() {
    NodeOutlineText.downloadTextOutline(this.nodeController.getRootNode());
  }

  handleColorMode() {
    this.modeManager.setMode(MouseConstants.MOUSE_MODES.CHANGE_COLOR);
  }

  handleResizeMode() {
    this.modeManager.setMode(MouseConstants.MOUSE_MODES.RESIZE);
  }

  handleRenameMode() {
    this.modeManager.setMode(MouseConstants.MOUSE_MODES.RENAME);
  }

  handleDeleteMode() {
    this.modeManager.setMode(MouseConstants.MOUSE_MODES.DELETE);
  }

  handleNormalMode() {
    this.modeManager.setMode(MouseConstants.MOUSE_MODES.NORMAL);
  }

  handleCopyColorMode() {
    this.modeManager.setMode(MouseConstants.MOUSE_MODES.COPY_COLOR);
  }
}
