import MindmapLocalStorage from "./MindmapLocalStorage.js";
// import DragAndDropHandler from "./DragAndDropHandler.js";

export default class MindmapHandler {
  constructor(nodeController) {
    this.nodeController = nodeController;
    this.localStorageHandler = new MindmapLocalStorage(nodeController);
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
