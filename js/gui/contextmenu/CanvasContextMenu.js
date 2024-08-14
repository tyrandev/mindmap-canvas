import ContextMenu from "./ContextMenu.js";
import StorageUtil from "../../util/storage/StorageUtil.js";

export default class CanvasContextMenu extends ContextMenu {
  constructor(systemCore) {
    super(systemCore, "canvas-context-menu");
    this.nodeController = systemCore.nodeController;
  }

  initContextMenu() {
    document
      .getElementById("center-mindmap")
      .addEventListener("click", this.centerMindmap.bind(this));
    document
      .getElementById("show-local-storage")
      .addEventListener("click", this.toggleLocalStorage.bind(this));
    document
      .getElementById("new-mindmap")
      .addEventListener("click", this.newMindmap.bind(this));
  }

  centerMindmap() {
    this.nodeController.moveRootNodeToCenter();
  }

  toggleLocalStorage() {
    StorageUtil.toggleStorageContainerDisplay();
  }

  newMindmap() {
    this.nodeController.resetMindmap();
  }
}
