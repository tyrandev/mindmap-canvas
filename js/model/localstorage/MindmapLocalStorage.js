import LocalStorageHandler from "./LocalStorageHandler.js";
import LocalStorageUIHandler from "../../gui/storage/LocalStorageUIHandler.js";

export default class MindmapLocalStorage {
  constructor(mindmapFileHandler, nodeController, mindmapSerializer) {
    this.localStorageHandler = new LocalStorageHandler("mindmaps");
    this.uiHandler = new LocalStorageUIHandler(mindmapFileHandler);
    this.nodeController = nodeController;
    this.mindmapSerializer = mindmapSerializer;
    this.currentJsonFile = null;
  }

  saveToLocalStorage(name, json) {
    this.localStorageHandler.saveItem(name, json);
    this.uiHandler.createLocalStorageList();
    this.currentJsonFile = name;
  }

  loadFromLocalStorage(name) {
    const json = this.localStorageHandler.getItem(name);
    if (json) {
      this._loadAndSetCurrentFile(json, name);
    }
  }

  deleteFromLocalStorage(name) {
    this.localStorageHandler.deleteItem(name);
    this.uiHandler.createLocalStorageList();
    if (this.currentJsonFile === name) {
      this.currentJsonFile = null;
    }
  }

  renameInLocalStorage(oldName, newName) {
    this.localStorageHandler.renameItem(oldName, newName);
    this.uiHandler.createLocalStorageList();
    if (this.currentJsonFile === oldName) {
      this.currentJsonFile = newName;
    }
  }

  listSavedMindMaps() {
    return this.localStorageHandler.listItems();
  }

  loadFromJson(event) {
    const file = event.target.files[0];
    if (!file) return;

    this._readFile(file, (json) => {
      this._loadAndSetCurrentFile(json, file.name);
    });
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
