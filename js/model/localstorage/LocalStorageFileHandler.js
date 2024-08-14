import NodeSerializer from "../../util/serializer/NodeSerializer.js";
import LocalStorageUIHandler from "../../gui/storage/LocalStorageUIHandler.js";

export default class LocalStorageFileHandler {
  constructor(nodeController) {
    this.nodeController = nodeController;
    this.uiHandler = new LocalStorageUIHandler(this);
    this.currentJsonFile = null;
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
    this._saveJsonToLocalStorage(name, json);
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
    const json = this._retrieveJsonFromLocalStorage(name);
    if (!json) return;

    this._loadAndSetCurrentFile(json, name);
  }

  deleteFromLocalStorage(name) {
    if (!this._isMindMapInLocalStorage(name)) {
      alert(`No mindmap found with the name "${name}".`);
      return;
    }
    this._removeMindMapFromLocalStorage(name);
    this.uiHandler.createLocalStorageList();
    if (this.currentJsonFile === name) {
      this.currentJsonFile = null;
    }
  }

  renameInLocalStorage(oldName, newName) {
    if (!this._isMindMapInLocalStorage(oldName)) {
      alert(`No mindmap found with the name "${oldName}".`);
      return;
    }
    if (this._isMindMapInLocalStorage(newName)) {
      alert(`A mindmap with the name "${newName}" already exists.`);
      return;
    }
    this._renameMindMapInLocalStorage(oldName, newName);
    this.uiHandler.createLocalStorageList();
    if (this.currentJsonFile === oldName) {
      this.currentJsonFile = newName;
    }
  }

  listSavedMindMaps() {
    return Object.keys(this._getSavedMindMaps());
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

  _saveJsonToLocalStorage(name, json) {
    const mindmaps = this._getSavedMindMaps();
    mindmaps[name] = json;
    localStorage.setItem("mindmaps", JSON.stringify(mindmaps));
  }

  _retrieveJsonFromLocalStorage(name) {
    const mindmaps = this._getSavedMindMaps();
    return mindmaps[name];
  }

  _isMindMapInLocalStorage(name) {
    return this._getSavedMindMaps()[name];
  }

  _removeMindMapFromLocalStorage(name) {
    const mindmaps = this._getSavedMindMaps();
    delete mindmaps[name];
    localStorage.setItem("mindmaps", JSON.stringify(mindmaps));
  }

  _renameMindMapInLocalStorage(oldName, newName) {
    const mindmaps = this._getSavedMindMaps();
    mindmaps[newName] = mindmaps[oldName];
    delete mindmaps[oldName];
    localStorage.setItem("mindmaps", JSON.stringify(mindmaps));
  }

  _getSavedMindMaps() {
    const mindmaps = localStorage.getItem("mindmaps");
    return mindmaps ? JSON.parse(mindmaps) : {};
  }
}
