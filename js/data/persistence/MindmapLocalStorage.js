import LocalStorageUIHandler from "../../gui/storage/LocalStorageUIHandler.js";
import LocalStorage from "./LocalStorage.js";
import NodeSerializer from "../serialization/NodeSerializer.js";
import MindmapState from "../../model/mindmap/MindmapState.js";

const LOCAL_STORAGE_KEY = "mindmaps";

export default class MindmapLocalStorage {
  constructor(nodeController) {
    this.nodeController = nodeController;
    this.localStorage = new LocalStorage(LOCAL_STORAGE_KEY);
    this.uiHandler = new LocalStorageUIHandler(this);
    this.mindmapState = MindmapState.getInstance();
  }

  saveToLocalStorage() {
    const name = this._getFilenameForSave();
    if (!name) return;
    const json = this._getSerializedJson();
    this.localStorage.saveItem(name, json);
    this.mindmapState.setCurrentMindmap(name, json);
    this.uiHandler.createLocalStorageList();
  }

  loadFromLocalStorage(name) {
    const json = this.localStorage.getItem(name);
    if (!json) return;
    this._loadMindMapFromJson(json);
    this.mindmapState.setCurrentMindmap(name, json);
  }

  deleteFromLocalStorage(name) {
    if (!this.localStorage.getItem(name)) {
      alert(`No mindmap found with the name "${name}".`);
      return;
    }
    this.localStorage.deleteItem(name);
    this.mindmapState.clearCurrentMindmap();
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
    this.mindmapState.setCurrentMindmap(
      newName,
      this.mindmapState.currentMindmapJson
    );
    this.uiHandler.createLocalStorageList();
  }

  listSavedMindMaps() {
    return this.localStorage.listItems();
  }

  _getSerializedJson() {
    return this.nodeController.serializeRootNode();
  }

  _getFilenameForSave() {
    const suggestedName = this.mindmapState.currentFilename || "";
    return prompt("Enter the filename for the JSON file:", suggestedName);
  }

  _loadMindMapFromJson(json) {
    const rootNode = NodeSerializer.deserialize(json);
    this.nodeController.loadMindMap(rootNode);
  }
}
