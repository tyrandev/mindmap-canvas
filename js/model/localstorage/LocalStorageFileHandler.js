import NodeSerializer from "../../util/serializer/NodeSerializer.js";
import LocalStorageUIHandler from "../../gui/storage/LocalStorageUIHandler.js";
import LocalStorageHandler from "./LocalStorageHandler.js";
import JsonExporter from "./JsonExporter.js";
import DragAndDropHandler from "./DragAndDropHandler.js";

const LOCAL_STORAGE_KEY = "mindmaps";

export default class LocalStorageFileHandler {
  constructor(nodeController) {
    this.nodeController = nodeController;
    this.localStorageHandler = new LocalStorageHandler(LOCAL_STORAGE_KEY);
    this.uiHandler = new LocalStorageUIHandler(this);
    this.jsonExporter = new JsonExporter(nodeController);
    this.currentJsonFile = null;

    this.dragAndDropHandler = new DragAndDropHandler();
    this._initializeEventListeners();
  }

  _initializeEventListeners() {
    document.addEventListener("fileLoaded", (event) => {
      const { json, filename } = event.detail;
      this._loadAndSetCurrentFile(json, filename);
    });
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

  _getSerializedJson() {
    return this.nodeController.serializeRootNode();
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
    const rootNode = NodeSerializer.deserialize(json);
    this.nodeController.loadMindMap(rootNode);
    this.currentJsonFile = filename;
  }
}
