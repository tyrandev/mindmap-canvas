import NodeColorHelper from "../model/geometric/node/helper/NodeColorHelper.js";
import * as CircleConstants from "../constants/CircleConstants.js";
import * as RectangleConstants from "../constants/RectangleConstants.js";
import Circle from "../model/geometric/circle/Circle.js";
import Rectangle from "../model/geometric/rectangle/Rectangle.js";
import StackEventEmitter from "../event/StackEventEmitter.js";

export default class SelectionManager {
  constructor() {
    this.selectedNode = null;
    this.originalNodeColor = null;
  }

  selectNode(node) {
    if (this.selectedNode === node) return;
    if (this.selectedNode && this.originalNodeColor) {
      this.selectedNode.setFillColor(this.originalNodeColor);
      this.selectedNode.borderWidth = CircleConstants.BASE_NODE_BORDER_WITH;
    }
    this.selectedNode = node;
    this.originalNodeColor = node.fillColor;
    this.selectedNode.setFillColor(
      NodeColorHelper.lightenColor(this.selectedNode.fillColor, 1.5)
    );
    this.selectedNode.borderWidth = CircleConstants.SELECTED_NODE_BORDER_WIDTH;
  }

  unselectNode() {
    if (!this.selectedNode) return;
    this.selectedNode.setFillColor(this.originalNodeColor);
    this.selectedNode.borderWidth = CircleConstants.BASE_NODE_BORDER_WITH;
    this.selectedNode = null;
    this.originalNodeColor = null;
    console.log("Node was unselected. Now it is:", this.selectedNode);
  }

  renameSelectedNode(newText) {
    if (!this.selectedNode) return;
    StackEventEmitter.emitSaveState();
    this.selectedNode.setText(newText);
  }

  renameSelectedNodePrompt() {
    const currentName = this.selectedNode.text || "";
    const newName = prompt("Enter new name for the node:", currentName);
    if (newName) {
      this.renameSelectedNode(newName);
    }
  }

  randomizeSelectedNodeColor() {
    if (!this.selectedNode) return;
    const randomColor = NodeColorHelper.getRandomLightColor();
    this.setSelectedNodeColor(randomColor);
  }

  setSelectedNodeColor(color) {
    if (!this.selectedNode) return;
    StackEventEmitter.emitSaveState();
    this.selectedNode.setFillColor(color);
    this.originalNodeColor = color;
  }

  updateSelectedNodeDimensions(deltaY) {
    if (this.selectedNode instanceof Circle) {
      const delta = Math.sign(deltaY);
      const increment = delta * CircleConstants.DEFAULT_RADIUS_INCREMENT;
      const newRadius = this.selectedNode.radius + increment;
      this.setSelectedCircleRadius(newRadius);
    } else if (this.selectedNode instanceof Rectangle) {
      const widthIncrement =
        deltaY * RectangleConstants.DEFAULT_WIDTH_INCREMENT;
      const heightIncrement =
        deltaY * RectangleConstants.DEFAULT_HEIGHT_INCREMENT;
      const newWidth = this.selectedNode.width + widthIncrement;
      const newHeight = this.selectedNode.height + heightIncrement;
      this.setSelectedRectangleDimensions(newWidth, newHeight);
    } else {
      return;
    }
    StackEventEmitter.emitSaveState();
  }

  setSelectedRectangleDimensions(newWidth, newHeight) {
    if (!(this.selectedNode instanceof Rectangle)) return;
    const validWidth = Math.max(
      newWidth,
      RectangleConstants.MIN_RECTANGLE_WIDTH
    );
    const validHeight = Math.max(
      newHeight,
      RectangleConstants.MIN_RECTANGLE_HEIGHT
    );
    if (
      isNaN(validWidth) ||
      validWidth <= 0 ||
      isNaN(validHeight) ||
      validHeight <= 0
    ) {
      console.error("Invalid dimensions");
      return;
    }
    this.selectedNode.setDimensions(validWidth, validHeight);
    this.selectedNode.actualiseText();
  }

  setSelectedCircleRadius(newRadius) {
    if (!(this.selectedNode instanceof Circle)) return;
    if (isNaN(newRadius) || newRadius <= 0) {
      console.error("invalid radius");
      return;
    }
    this.selectedNode.setRadius(newRadius);
    this.selectedNode.actualiseText();
  }

  toggleSelectedNodeCollapse() {
    StackEventEmitter.emitSaveState();
    if (!this.selectedNode || !this.selectedNode.hasChildren()) return;

    this.selectedNode.toggleCollapse();
  }

  getSelectedNode() {
    return this.selectedNode;
  }
}
