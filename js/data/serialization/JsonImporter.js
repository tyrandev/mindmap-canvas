import NodeSerializer from "./NodeSerializer.js";
import fileInputManager from "../../util/file/FileInputManager.js";
import MindmapState from "../../model/mindmap/MindmapState.js";

export default class JsonImporter {
  constructor(nodeController) {
    this.nodeController = nodeController;
    this.setupFileInput();
    this._initializeEventListeners();
    this.mindmapState = MindmapState.getInstance();
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
          this._loadFromJson(json, file.name);
          resolve({ json, filename: file.name });
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }

  importFromJsonString(jsonString, filename = null) {
    try {
      this._loadFromJson(jsonString, filename);
    } catch (error) {
      throw new Error("Invalid JSON string");
    }
  }

  _loadFromJson(json, filename) {
    const rootNode = NodeSerializer.deserialize(json);
    this.nodeController.loadMindMap(rootNode);
    this.mindmapState.setCurrentMindmap(filename, json);
  }

  _initializeEventListeners() {
    document.addEventListener("fileLoaded", (event) => {
      const { json, filename } = event.detail;
      this.importFromJsonString(json, filename);
    });
  }
}
