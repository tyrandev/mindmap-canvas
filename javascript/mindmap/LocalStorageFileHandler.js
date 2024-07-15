import CircleSerializer from "../circle/helper/CircleSerializer.js";
import LocalStorageUIHandler from "./LocalStorageUIHandler.js";

export default class LocalStorageFileHandler {
  constructor(circleController) {
    this.circleController = circleController;
    this.uiHandler = new LocalStorageUIHandler(this);
  }

  saveToJson() {
    const rootCircle = this.circleController.getMotherCircle();
    const json = CircleSerializer.serialize(rootCircle);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const filename = prompt(
      "Enter the filename for the JSON file:",
      "mindmap.json"
    );

    const downloadFilename = filename ? filename : "mindmap.json";

    const a = document.createElement("a");
    a.href = url;
    a.download = downloadFilename;
    a.click();
    URL.revokeObjectURL(url);
  }

  loadFromJson(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const json = e.target.result;
      const rootCircle = CircleSerializer.deserialize(json);
      this.circleController.resetAllCircles();
      this.circleController.addCircleAndChildren(rootCircle);
      this.circleController.drawCircles();
    };
    reader.readAsText(file);
  }

  saveToLocalStorage(name, json) {
    const mindmaps = this.getSavedMindMaps();
    mindmaps[name] = json;
    localStorage.setItem("mindmaps", JSON.stringify(mindmaps));
    this.uiHandler.createLocalStorageList();
  }

  loadFromLocalStorage(name) {
    const mindmaps = this.getSavedMindMaps();
    const json = mindmaps[name];
    if (!json) {
      alert(`No mindmap found with the name "${name}".`);
      return;
    }

    const rootCircle = CircleSerializer.deserialize(json);
    this.circleController.resetAllCircles();
    this.circleController.addCircleAndChildren(rootCircle);
    this.circleController.drawCircles();
  }

  getSavedMindMaps() {
    const mindmaps = localStorage.getItem("mindmaps");
    return mindmaps ? JSON.parse(mindmaps) : {};
  }

  deleteFromLocalStorage(name) {
    const mindmaps = this.getSavedMindMaps();
    if (!mindmaps[name]) {
      alert(`No mindmap found with the name "${name}".`);
      return;
    }

    delete mindmaps[name];
    localStorage.setItem("mindmaps", JSON.stringify(mindmaps));
    this.uiHandler.createLocalStorageList();
  }

  renameInLocalStorage(oldName, newName) {
    const mindmaps = this.getSavedMindMaps();
    if (!mindmaps[oldName]) {
      alert(`No mindmap found with the name "${oldName}".`);
      return;
    }
    if (mindmaps[newName]) {
      alert(`A mindmap with the name "${newName}" already exists.`);
      return;
    }

    mindmaps[newName] = mindmaps[oldName];
    delete mindmaps[oldName];
    localStorage.setItem("mindmaps", JSON.stringify(mindmaps));
    this.uiHandler.createLocalStorageList();
  }

  listSavedMindMaps() {
    const mindmaps = this.getSavedMindMaps();
    return Object.keys(mindmaps);
  }
}
