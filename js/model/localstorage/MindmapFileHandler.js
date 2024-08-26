import JsonExportHandler from "./JsonExportHandler.js";
import MindmapSerializer from "./MindmapSerializer.js";
import DragAndDropHandler from "./DragAndDropHandler.js";
import MindmapLocalStorage from "./MindmapLocalStorage.js";

export default class MindmapFileHandler {
  constructor(nodeController) {
    this.nodeController = nodeController;
    this.jsonExportHandler = new JsonExportHandler(nodeController);
    this.mindmapSerializer = new MindmapSerializer(nodeController);
    this.mindmapLocalStorage = new MindmapLocalStorage(
      this,
      nodeController,
      this.mindmapSerializer
    );
    this.currentJsonFile = null;
    this.dragAndDropHandler = new DragAndDropHandler(
      this.loadFromFile.bind(this)
    );

    // Initialize UI Handler after full setup
    this.mindmapLocalStorage.initializeUIHandler(this);
  }

  loadFromFile(file) {
    if (file) {
      this._readFile(file, (json) => {
        this._loadAndSetCurrentFile(json, file.name);
      });
    }
  }

  exportToJson() {
    this.jsonExportHandler.exportToJson(this.currentJsonFile);
  }

  saveToLocalStorage() {
    const name = this._getFilenameForSave();
    if (!name) return;

    const json = this.mindmapSerializer.serialize();
    this.mindmapLocalStorage.saveToLocalStorage(name, json);
    this.currentJsonFile = name;
  }

  loadFromLocalStorage(name) {
    this.mindmapLocalStorage.loadFromLocalStorage(
      name,
      this._loadAndSetCurrentFile.bind(this)
    );
  }

  deleteFromLocalStorage(name) {
    this.mindmapLocalStorage.deleteFromLocalStorage(name);
  }

  renameInLocalStorage(oldName, newName) {
    this.mindmapLocalStorage.renameInLocalStorage(oldName, newName);
  }

  listSavedMindMaps() {
    return this.mindmapLocalStorage.listSavedMindMaps();
  }

  _getFilenameForSave() {
    const suggestedName = this.currentJsonFile || "";
    return prompt("Enter the filename for the JSON file:", suggestedName);
  }

  _readFile(file, callback) {
    const reader = new FileReader();
    reader.onload = (e) => callback(e.target.result);
    reader.readAsText(file);
  }

  _loadAndSetCurrentFile(json, filename) {
    const rootCircle = this.mindmapSerializer.deserialize(json);
    this.nodeController.loadMindMap(rootCircle);
    this.currentJsonFile = filename;
  }
}
