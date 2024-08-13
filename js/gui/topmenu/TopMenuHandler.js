import PdfConverter from "../../util/converter/media/PdfConverter.js";
import ImgConverter from "../../util/converter/media/ImgConverter.js";
import NodeOutlineText from "../../util/converter/text/NodeOutlineText.js";
import FileInputManager from "../../util/file/FileInputManager.js";
import MouseModeManager from "../mouse/MouseModeManager.js";
import * as MouseConstants from "../../constants/MouseConstants.js";

export default class TopMenuHandler {
  constructor(mindMap) {
    this.mindMap = mindMap;
    this.initEventListeners();
    this.modeManager = MouseModeManager;
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
      .addEventListener("click", () =>
        this.modeManager.setMode(MouseConstants.MOUSE_MODES.COLOR)
      );
    document
      .getElementById("resize-button")
      .addEventListener("click", () =>
        this.modeManager.setMode(MouseConstants.MOUSE_MODES.RESIZE)
      );
    document
      .getElementById("rename-button")
      .addEventListener("click", () =>
        this.modeManager.setMode(MouseConstants.MOUSE_MODES.RENAME)
      );
    document
      .getElementById("delete-node-button")
      .addEventListener("click", () =>
        this.modeManager.setMode(MouseConstants.MOUSE_MODES.DELETE)
      );
    document
      .getElementById("normal-cursor-mode")
      .addEventListener("click", () =>
        this.modeManager.setMode(MouseConstants.MOUSE_MODES.NORMAL)
      );
    document
      .getElementById("copy-color-button")
      .addEventListener("click", () =>
        this.modeManager.setMode(MouseConstants.MOUSE_MODES.COPY_COLOR)
      );
  }

  handleUndo() {
    this.mindMap.nodeController.undo();
  }

  handleRedo() {
    this.mindMap.nodeController.redo();
  }

  handleSave() {
    this.mindMap.fileHandler.saveToLocalStorage();
  }

  handleImport() {
    const fileInput = FileInputManager.getFileInput();
    fileInput.click();
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
      this.mindMap.nodeController.getRootNode()
    );
  }

  //TODO: add method for each event listener
}
