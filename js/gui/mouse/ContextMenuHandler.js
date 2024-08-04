import MousePosition from "./MousePosition.js";

const DEFAULT_COLOR_PICKER_COLOR = "#ffffff";

export default class ContextMenuHandler {
  constructor(mindMap, nodeController) {
    this.mindMap = mindMap;
    this.nodeController = nodeController;
    this.contextMenu = document.getElementById("node-context-menu");
    this.contextMenuCircle = null;
    this.colorPicker = document.getElementById("color-picker");
    this.colorPicker.addEventListener("input", this.applyColor.bind(this));
    this.colorPicker.value = DEFAULT_COLOR_PICKER_COLOR;
    this.initContextMenu();
    document.addEventListener("click", this.handleDocumentClick.bind(this));

    this.mousePosition = MousePosition.getInstance();
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

  showContextMenu(circle, x, y) {
    const rect = this.mindMap.canvas.getBoundingClientRect();
    const adjustedX = rect.left + x;
    const adjustedY = rect.top + y;
    this.contextMenu.style.display = "block";
    this.contextMenu.style.left = `${adjustedX}px`;
    this.contextMenu.style.top = `${adjustedY}px`;
    this.contextMenuCircle = circle;
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
    if (!this.contextMenuCircle) return;
    const { x, y } = this.mousePosition.getMouseCoordinates();
    this.nodeController.addConnectedCircle(this.contextMenuCircle, x, y);
    this.hideContextMenu();
  }

  addRectangle() {
    if (!this.contextMenuCircle) return;
    const { x, y } = this.mousePosition.getMouseCoordinates();
    this.nodeController.addConnectedRectangle(this.contextMenuCircle, x, y);
    this.hideContextMenu();
  }

  renameNode() {
    if (!this.contextMenuCircle) return;
    this.nodeController.renameSelectedNodePrompt();
    this.hideContextMenu();
  }

  collapseNode() {
    if (!this.contextMenuCircle) return;
    this.nodeController.toggleSelectedNodeCollapse();
    this.hideContextMenu();
  }

  deleteNode() {
    if (!this.contextMenuCircle) return;
    this.nodeController.removeNode(this.contextMenuCircle);
    this.hideContextMenu();
  }

  resizeNode() {
    if (!this.contextMenuCircle) {
      console.error("No circle selected for resizing.");
      return;
    }
    const newRadiusStr = prompt(
      "Enter new radius for the node:",
      this.contextMenuCircle.radius
    );
    if (newRadiusStr === null) return;
    const newRadius = parseFloat(newRadiusStr);
    if (isNaN(newRadius) || newRadius <= 0) {
      alert("Invalid radius value. Please enter a number greater than 0.");
      return;
    }
    this.contextMenuCircle.setRadius(newRadius);
    this.nodeController.drawNodes();
    this.hideContextMenu();
  }

  selectColorNode() {
    if (!this.contextMenuCircle) return;
    this.colorPicker.click(); // Show the color picker
  }

  applyColor(event) {
    if (!this.contextMenuCircle) return;
    const selectedColor = event.target.value;
    this.nodeController.setSelectedNodeColor(selectedColor);
    this.hideContextMenu();
  }

  randomColorNode() {
    if (!this.contextMenuCircle) return;
    this.nodeController.randomizeSelectedNodeColor();
    this.hideContextMenu();
  }
}
