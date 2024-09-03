import ContextMenu from "./ContextMenu.js";
import ColorPicker from "../topmenu/ColorPicker.js";

export default class NodeContextMenu extends ContextMenu {
  constructor(systemCore) {
    super(systemCore, "node-context-menu");
    this.nodeController = this.systemCore.nodeController;
    this.selectionController = this.nodeController.selectionController;
    this.colorPicker = ColorPicker.getColorPicker();
    this.handleBorderColorChange = this.handleBorderColorChange.bind(this);
    this.handleFillColorChange = this.handleFillColorChange.bind(this);
    this.addBorderlessRectangle = this.addBorderlessRectangle.bind(this);
    this.colorPicker.addEventListener("input", this.handleFillColorChange);
    this.colorPicker.addEventListener(
      "colorChange",
      this.handleBorderColorChange
    );
  }

  initContextMenu() {
    document
      .getElementById("add-node")
      .addEventListener("click", this.addCircle.bind(this));
    document
      .getElementById("add-rectangle")
      .addEventListener("click", this.addRectangle.bind(this));
    document
      .getElementById("add-borderless-rectangle")
      .addEventListener("click", this.addBorderlessRectangle.bind(this));
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
    document
      .getElementById("select-border-color-node")
      .addEventListener("click", this.selectBorderColorNode.bind(this));
  }

  showContextMenu(node, x, y) {
    this.prepareContextMenu(x, y);
    this.contextMenu.style.display = "block";
    this.contextMenuNode = node;
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

  addBorderlessRectangle() {
    if (!this.contextMenuNode) return;
    this.nodeController.addConnectedBorderlessRectangle(this.contextMenuNode);
    this.hideContextMenu();
  }

  renameNode() {
    if (!this.contextMenuNode) return;
    this.selectionController.renameSelectedNodePrompt();
    this.hideContextMenu();
  }

  collapseNode() {
    if (!this.contextMenuNode) return;
    this.selectionController.toggleSelectedNodeCollapse();
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
    this.selectionController.setSelectedCircleRadius(newRadius);
    this.hideContextMenu();
  }

  selectColorNode() {
    if (!this.contextMenuNode) return;
    // Set a flag to indicate fill color change
    this.colorPicker.colorMode = "fill";
    this.colorPicker.trigger();
  }

  selectBorderColorNode() {
    if (!this.contextMenuNode) return;
    // Set a flag to indicate border color change
    this.colorPicker.colorMode = "border";
    this.colorPicker.trigger();
    console.log("Select border color node called");
  }

  handleBorderColorChange(event) {
    if (!this.contextMenuNode || this.colorPicker.colorMode !== "border")
      return;
    console.log("Handle border color change called");
    const selectedColor = event.detail.color; // Ensure the event structure is correct
    console.log("Color selected: ", selectedColor);
    this.contextMenuNode.setBorderColor(selectedColor);
    this.hideContextMenu();
  }

  handleFillColorChange(event) {
    if (!this.contextMenuNode || this.colorPicker.colorMode !== "fill") return;
    const selectedColor = event.target.value;
    this.selectionController.setSelectedNodeColor(selectedColor);
    this.hideContextMenu();
  }

  randomColorNode() {
    if (!this.contextMenuNode) return;
    this.selectionController.randomizeSelectedNodeColor();
    this.hideContextMenu();
  }
}
