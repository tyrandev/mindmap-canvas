import Canvas from "../../view/Canvas.js";
import StorageUtil from "../../util/storage/StorageUtil.js";

export default class CanvasContextMenuHandler {
  constructor(systemCore) {
    this.systemCore = systemCore;
    this.nodeController = systemCore.nodeController;
    this.canvas = Canvas.getCanvas();
    this.contextMenu = document.getElementById("canvas-context-menu");
    this.initContextMenu();
    document.addEventListener("click", this.handleDocumentClick.bind(this));
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

  showContextMenu(x, y) {
    const rect = this.canvas.getBoundingClientRect();
    const adjustedX = rect.left + x;
    const adjustedY = rect.top + y;
    this.contextMenu.style.display = "block";
    this.contextMenu.style.left = `${adjustedX}px`;
    this.contextMenu.style.top = `${adjustedY}px`;
  }

  hideContextMenu() {
    this.contextMenu.style.display = "none";
    Canvas.regainFocus();
  }

  handleDocumentClick(event) {
    if (event.button !== 2) {
      this.hideContextMenu();
    }
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
