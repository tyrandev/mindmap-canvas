import NodeSerializer from "../../util/serializer/NodeSerializer.js";
import LocalStorageUIHandler from "../../gui/storage/LocalStorageUIHandler.js";
import LocalStorageHandler from "./LocalStorageHandler.js";

const LOCAL_STORAGE_KEY = "mindmaps";

export default class LocalStorageFileHandler {
  constructor(nodeController) {
    this.nodeController = nodeController;
    this.localStorageHandler = new LocalStorageHandler(LOCAL_STORAGE_KEY);
    this.uiHandler = new LocalStorageUIHandler(this);
    this.currentJsonFile = null;

    // Initialize drag-and-drop functionality
    this._initializeDragAndDrop();
  }

  _initializeDragAndDrop() {
    document.body.addEventListener("dragover", this._handleDragOver.bind(this));
    document.body.addEventListener("drop", this._handleDrop.bind(this));
  }

  _handleDragOver(event) {
    event.preventDefault(); // Necessary to allow the drop
  }

  _handleDrop(event) {
    event.preventDefault();

    const file = event.dataTransfer.files[0];
    if (file) {
      this.loadFromFile(file);
    }
  }

  loadFromFile(file) {
    if (file) {
      this._readFile(file, (json) => {
        this._loadAndSetCurrentFile(json, file.name);
      });
    }
  }

  exportToJson() {
    const filename = this._getFilenameForExport();
    if (!filename) return;

    const json = this._getSerializedJson();
    this._downloadFile(filename, json);
  }

  saveToLocalStorage() {
    const name = this._getFilenameForSave();
    if (!name) return;

    const json = this._getSerializedJson();
    this.localStorageHandler.saveItem(name, json);
    this.uiHandler.createLocalStorageList();
    this.currentJsonFile = name;
  }

  loadFromJson(event) {
    const file = event.target.files[0];
    if (!file) return;

    this._readFile(file, (json) => {
      this._loadAndSetCurrentFile(json, file.name);
    });
  }

  loadFromLocalStorage(name) {
    const json = this.localStorageHandler.getItem(name);
    if (!json) return;

    this._loadAndSetCurrentFile(json, name);
  }

  deleteFromLocalStorage(name) {
    if (!this.localStorageHandler.getItem(name)) {
      alert(`No mindmap found with the name "${name}".`);
      return;
    }
    this.localStorageHandler.deleteItem(name);
    this.uiHandler.createLocalStorageList();
    if (this.currentJsonFile === name) {
      this.currentJsonFile = null;
    }
  }

  renameInLocalStorage(oldName, newName) {
    if (!this.localStorageHandler.getItem(oldName)) {
      alert(`No mindmap found with the name "${oldName}".`);
      return;
    }
    if (this.localStorageHandler.getItem(newName)) {
      alert(`A mindmap with the name "${newName}" already exists.`);
      return;
    }
    this.localStorageHandler.renameItem(oldName, newName);
    this.uiHandler.createLocalStorageList();
    if (this.currentJsonFile === oldName) {
      this.currentJsonFile = newName;
    }
  }

  listSavedMindMaps() {
    return this.localStorageHandler.listItems();
  }

  _getFilenameForExport() {
    const suggestedName = this.currentJsonFile || "";
    return prompt("Enter the name to export the mind map:", suggestedName);
  }

  _getFilenameForSave() {
    const suggestedName = this.currentJsonFile || "";
    return prompt("Enter the filename for the JSON file:", suggestedName);
  }

  _getSerializedJson() {
    const rootCircle = this.nodeController.getRootNode();
    return NodeSerializer.serialize(rootCircle);
  }

  _downloadFile(filename, content) {
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  _readFile(file, callback) {
    const reader = new FileReader();
    reader.onload = (e) => callback(e.target.result);
    reader.readAsText(file);
  }

  _loadAndSetCurrentFile(json, filename) {
    const rootCircle = NodeSerializer.deserialize(json);
    this.nodeController.loadMindMap(rootCircle);
    this.currentJsonFile = filename;
  }
}
