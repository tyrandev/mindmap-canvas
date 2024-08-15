import Canvas from "../../view/Canvas.js";

export default class ContextMenu {
  constructor(systemCore, contextMenuId) {
    this.systemCore = systemCore;
    this.contextMenu = document.getElementById(contextMenuId);
    this.canvas = this.getCanvas();
    this.contextMenuNode = null;

    this.initContextMenu();
    this.preventBrowserContextMenu();
    document.addEventListener("click", this.handleDocumentClick.bind(this));
  }

  getCanvas() {
    return Canvas.getCanvas();
  }

  initContextMenu() {
    throw new Error("initContextMenu() must be implemented by subclass");
  }

  prepareContextMenu(x, y) {
    const rect = this.canvas.getBoundingClientRect();
    const adjustedX = rect.left + x;
    const adjustedY = rect.top + y;
    this.contextMenu.style.left = `${adjustedX}px`;
    this.contextMenu.style.top = `${adjustedY}px`;
  }

  showContextMenu(x, y) {
    this.prepareContextMenu(x, y);
    this.contextMenu.style.display = "block";
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

  preventBrowserContextMenu() {
    this.contextMenu.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });
  }
}
