import LocalStorageUIHandler from "../../gui/storage/LocalStorageUIHandler.js";
import LocalStorage from "./LocalStorage.js";
import DragAndDropHandler from "./DragAndDropHandler.js";
import JsonImporter from "./JsonImporter.js";
import NodeSerializer from "../../util/serializer/NodeSerializer.js";

const LOCAL_STORAGE_KEY = "mindmaps";

export default class MindmapHandler {
  constructor(nodeController) {
    this.nodeController = nodeController;
    this.localStorage = new LocalStorage(LOCAL_STORAGE_KEY);
    this.uiHandler = new LocalStorageUIHandler(this);
    this.jsonImporter = new JsonImporter(nodeController);
    this.dragAndDropHandler = new DragAndDropHandler();
    this.currentJsonFile = "name";
    this._initializeEventListeners();
  }

  _initializeEventListeners() {
    document.addEventListener("fileLoaded", (event) => {
      const { json, filename } = event.detail;
      this._loadMindMapFromJson(json);
    });
  }

  saveToLocalStorage() {
    const name = this._getFilenameForSave();
    if (!name) return;

    const json = this._getSerializedJson();
    this.localStorage.saveItem(name, json);
    this.uiHandler.createLocalStorageList();
  }

  loadFromLocalStorage(name) {
    const json = this.localStorage.getItem(name);
    if (!json) return;
    this._loadMindMapFromJson(json);
  }

  deleteFromLocalStorage(name) {
    if (!this.localStorage.getItem(name)) {
      alert(`No mindmap found with the name "${name}".`);
      return;
    }
    this.localStorage.deleteItem(name);
    this.uiHandler.createLocalStorageList();
  }

  renameInLocalStorage(oldName, newName) {
    if (!this.localStorage.getItem(oldName)) {
      alert(`No mindmap found with the name "${oldName}".`);
      return;
    }
    if (this.localStorage.getItem(newName)) {
      alert(`A mindmap with the name "${newName}" already exists.`);
      return;
    }
    this.localStorage.renameItem(oldName, newName);
    this.uiHandler.createLocalStorageList();
  }

  listSavedMindMaps() {
    return this.localStorage.listItems();
  }

  _getSerializedJson() {
    return this.nodeController.serializeRootNode();
  }

  _getFilenameForSave() {
    const suggestedName = this.currentJsonFile || "";
    return prompt("Enter the filename for the JSON file:", suggestedName);
  }

  _loadMindMapFromJson(json) {
    const rootNode = NodeSerializer.deserialize(json);
    this.nodeController.loadMindMap(rootNode);
  }
}
