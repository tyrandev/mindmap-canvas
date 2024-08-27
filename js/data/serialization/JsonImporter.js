import NodeSerializer from "./NodeSerializer.js";
import fileInputManager from "../../util/file/FileInputManager.js";

export default class JsonImporter {
  constructor(nodeController) {
    this.nodeController = nodeController;
    this.setupFileInput();
    this._initializeEventListeners();
  }

  setupFileInput() {
    this.fileInput = fileInputManager.getFileInput();
    this.fileInput.addEventListener(
      "change",
      this.handleFileInputChange.bind(this)
    );
  }

  handleFileInputChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    this.importFromFile(file).catch((error) => {
      console.error("Error loading JSON:", error);
    });
  }

  importFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = e.target.result;
          this._loadFromJson(json);
          resolve({ json, filename: file.name });
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }

  importFromJsonString(jsonString) {
    try {
      this._loadFromJson(jsonString);
    } catch (error) {
      throw new Error("Invalid JSON string");
    }
  }

  _loadFromJson(json) {
    const rootNode = NodeSerializer.deserialize(json);
    this.nodeController.loadMindMap(rootNode);
  }

  _initializeEventListeners() {
    document.addEventListener("fileLoaded", (event) => {
      const { json } = event.detail;
      this.importFromJsonString(json);
    });
  }
}
