import MindmapLocalStorage from "./MindmapLocalStorage.js";
import DragAndDropHandler from "./DragAndDropHandler.js";
import JsonImporter from "./JsonImporter.js";

export default class MindmapHandler {
  constructor(nodeController) {
    this.nodeController = nodeController;
    this.localStorageHandler = new MindmapLocalStorage(nodeController);
    this.jsonImporter = new JsonImporter(nodeController);
    this.dragAndDropHandler = new DragAndDropHandler();
    this._initializeEventListeners();
  }

  _initializeEventListeners() {
    document.addEventListener("fileLoaded", (event) => {
      const { json } = event.detail;
      this.jsonImporter.importFromJsonString(json);
    });
  }

  saveToLocalStorage() {
    this.localStorageHandler.saveToLocalStorage();
  }

  loadFromLocalStorage(name) {
    this.localStorageHandler.loadFromLocalStorage(name);
  }

  deleteFromLocalStorage(name) {
    this.localStorageHandler.deleteFromLocalStorage(name);
  }

  renameInLocalStorage(oldName, newName) {
    this.localStorageHandler.renameInLocalStorage(oldName, newName);
  }

  listSavedMindMaps() {
    return this.localStorageHandler.listSavedMindMaps();
  }
}
