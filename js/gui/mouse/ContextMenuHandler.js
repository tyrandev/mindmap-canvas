import * as GlobalConstants from "../../constants/GlobalConstants.js";

const DEFAULT_COLOR_PICKER_COLOR = "#ffffff";

export default class ContextMenuHandler {
  constructor(mindMap) {
    this.mindMap = mindMap;
    this.nodeController = this.mindMap.nodeController;
    this.canvas = document.getElementById(GlobalConstants.MINDMAP_CANVAS_ID);
    this.contextMenu = document.getElementById("node-context-menu");
    this.contextMenuNode = null;
    this.colorPicker = document.getElementById("color-picker");
    this.colorPicker.addEventListener("input", this.applyColor.bind(this));
    this.colorPicker.value = DEFAULT_COLOR_PICKER_COLOR;
    this.initContextMenu();
    document.addEventListener("click", this.handleDocumentClick.bind(this));
  }

  initContextMenu() {
    document
      .getElementById("add-node")
      .addEventListener("click", this.addCircle.bind(this));
    document
      .getElementById("add-rectangle")
      .addEventListener("click", this.addRectangle.bind(this));
    document
      .getElementById("rename-node")
      .addEventListener("click", this.renameNode.bind(this));
    document
      .getElementById("delete-node")
      .addEventListener("click", this.deleteNode.bind(this));
    document
      .getElementById("resize-node")
      .addEventListener("click", this.resizeNode.bind(this));
    document
      .getElementById("collapse-node")
      .addEventListener("click", this.collapseNode.bind(this));
    document
      .getElementById("select-color-node")
      .addEventListener("click", this.selectColorNode.bind(this));
    document
      .getElementById("random-color-node")
      .addEventListener("click", this.randomColorNode.bind(this));
  }

  showContextMenu(node, x, y) {
    const rect = this.canvas.getBoundingClientRect();
    const adjustedX = rect.left + x;
    const adjustedY = rect.top + y;
    this.contextMenu.style.display = "block";
    this.contextMenu.style.left = `${adjustedX}px`;
    this.contextMenu.style.top = `${adjustedY}px`;
    this.contextMenuNode = node;
  }

  hideContextMenu() {
    this.contextMenu.style.display = "none";
  }

  handleDocumentClick(event) {
    if (event.button !== 2) {
      this.hideContextMenu();
    }
  }

  addCircle() {
    if (!this.contextMenuNode) return;
    this.nodeController.addConnectedCircle(this.contextMenuNode);
    this.hideContextMenu();
  }

  addRectangle() {
    if (!this.contextMenuNode) return;
    this.nodeController.addConnectedRectangle(this.contextMenuNode);
    this.hideContextMenu();
  }

  renameNode() {
    if (!this.contextMenuNode) return;
    this.nodeController.renameSelectedNodePrompt();
    this.hideContextMenu();
  }

  collapseNode() {
    if (!this.contextMenuNode) return;
    this.nodeController.toggleSelectedNodeCollapse();
    this.hideContextMenu();
  }

  deleteNode() {
    if (!this.contextMenuNode) return;
    this.nodeController.removeNode(this.contextMenuNode);
    this.hideContextMenu();
  }

  resizeNode() {
    if (!this.contextMenuNode) {
      console.error("No circle selected for resizing.");
      return;
    }
    const newRadiusStr = prompt(
      "Enter new radius for the node:",
      this.contextMenuNode.radius
    );
    if (newRadiusStr === null) return;
    const newRadius = parseFloat(newRadiusStr);
    if (isNaN(newRadius) || newRadius <= 0) {
      alert("Invalid radius value. Please enter a number greater than 0.");
      return;
    }
    this.nodeController.setSelectedCircleRadius(newRadius);
    this.hideContextMenu();
  }

  selectColorNode() {
    if (!this.contextMenuNode) return;
    this.colorPicker.click(); // Show the color picker
  }

  applyColor(event) {
    if (!this.contextMenuNode) return;
    const selectedColor = event.target.value;
    this.nodeController.setSelectedNodeColor(selectedColor);
    this.hideContextMenu();
  }

  randomColorNode() {
    if (!this.contextMenuNode) return;
    this.nodeController.randomizeSelectedNodeColor();
    this.hideContextMenu();
  }
}
