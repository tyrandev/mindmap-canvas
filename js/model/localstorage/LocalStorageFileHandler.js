import LocalStorageUIHandler from "../../gui/storage/LocalStorageUIHandler.js";
import LocalStorageHandler from "./LocalStorageHandler.js";
import JsonExporter from "./JsonExporter.js";
import DragAndDropHandler from "./DragAndDropHandler.js";
import JsonImporter from "./JsonImporter.js";

const LOCAL_STORAGE_KEY = "mindmaps";

export default class LocalStorageFileHandler {
  constructor(nodeController) {
    this.nodeController = nodeController;
    this.localStorageHandler = new LocalStorageHandler(LOCAL_STORAGE_KEY);
    this.uiHandler = new LocalStorageUIHandler(this);
    this.jsonExporter = new JsonExporter(nodeController);
    this.jsonImporter = new JsonImporter(nodeController);
    this.dragAndDropHandler = new DragAndDropHandler();
    this.currentJsonFile = "name";
    this._initializeEventListeners();
  }

  _initializeEventListeners() {
    document.addEventListener("fileLoaded", (event) => {
      const { json, filename } = event.detail;
      this.jsonImporter.importFromJsonString(json);
      // this.currentJsonFile = filename; // This line is removed as it's not important
    });
  }

  saveToLocalStorage() {
    const name = this._getFilenameForSave();
    if (!name) return;

    const json = this._getSerializedJson();
    this.localStorageHandler.saveItem(name, json);
    this.uiHandler.createLocalStorageList();
    // this.currentJsonFile = name; // This line is removed as it's not important
  }

  loadFromJson(event) {
    const file = event.target.files[0];
    if (!file) return;

    this.jsonImporter.importFromFile(file).catch((error) => {
      console.error("Error loading JSON:", error);
    });
  }

  loadFromLocalStorage(name) {
    const json = this.localStorageHandler.getItem(name);
    if (!json) return;

    this.jsonImporter.importFromJsonString(json);
    // this.currentJsonFile = name; // This line is removed as it's not important
  }

  deleteFromLocalStorage(name) {
    if (!this.localStorageHandler.getItem(name)) {
      alert(`No mindmap found with the name "${name}".`);
      return;
    }
    this.localStorageHandler.deleteItem(name);
    this.uiHandler.createLocalStorageList();
    // if (this.currentJsonFile === name) {
    //   this.currentJsonFile = null; // This line is removed as it's not important
    // }
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
    // if (this.currentJsonFile === oldName) {
    //   this.currentJsonFile = newName; // This line is removed as it's not important
    // }
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
}
