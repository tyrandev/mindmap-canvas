import Circle from "../model/geometric/circle/Circle.js";
import NodeColorHelper from "../model/geometric/node/helper/NodeColorHelper.js";
import * as CircleConstants from "../model/geometric/circle/CircleConstants.js";
import CircleStackManager from "./CircleStackManager.js";

export default class CircleController {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.context = context;
    this.nodes = []; // it is used for checking if we click on circle
    this.selectedCircle = null;
    this.originalColor = null;
    this.stackManager = new CircleStackManager();
    this.initRootCircle();
  }

  //TODO: this position should not be a magic number but it should be based on #canvas-container 55% height and 45% of width approximatelly
  initRootCircle(initialText = "Mindmap") {
    const sampleCircle = new Circle(
      1335,
      860,
      CircleConstants.BASE_CIRCLE_RADIUS,
      initialText
    );
    this.addNode(sampleCircle);
  }

  clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  resetAllNodes() {
    clearCanvas();
    this.nodes.forEach((circle) => (circle.toBeRemoved = true));
    this.nodes = [];
    this.drawNodes();
  }

  addNode(node) {
    this.stackManager.saveStateForUndo(this.getRootCircle());
    this.nodes.push(node);
    this.drawNodes();
  }

  addNodeAndChildren(node) {
    const addCircleRecursively = (node) => {
      this.nodes.push(node);
      node.children.forEach(addCircleRecursively);
    };
    addCircleRecursively(node);
    this.drawNodes();
  }

  drawNodes() {
    this.clearCanvas();
    this.nodes.forEach((node) => node.drawNodes(this.context));
  }

  getNodeAtPosition(x, y) {
    return this.nodes.find((node) => node.isPointInsideOfNode(x, y));
  }

  moveNode(node, newX, newY) {
    const deltaX = newX - node.x;
    const deltaY = newY - node.y;
    if (
      Math.sqrt(deltaX ** 2 + deltaY ** 2) >=
      CircleConstants.DISTANCE_MOVED_TO_SAVE_STATE
    ) {
      this.stackManager.saveStateForUndo(this.getRootCircle());
      console.log("enough distance travelled for save state");
    }
    node.x = newX;
    node.y = newY;
    this.moveDescendants(node, deltaX, deltaY);
    this.drawNodes();
  }

  moveDescendants(node, deltaX, deltaY) {
    node.children.forEach((child) => {
      child.x += deltaX;
      child.y += deltaY;
      this.moveDescendants(child, deltaX, deltaY);
    });
  }

  removeNode(node) {
    if (node.id === 0) {
      console.log("Parent node cannot be removed", node);
      return;
    }
    this.stackManager.saveStateForUndo(this.getRootCircle());
    this.selectedCircle = null;
    this.markNodeAndConnectionsForRemoval(node);
    this.nodes = this.nodes.filter((c) => !c.toBeRemoved);
    this.drawNodes();
  }

  markNodeAndConnectionsForRemoval(node) {
    node.toBeRemoved = true;
    node.children.forEach((child) => {
      this.markNodeAndConnectionsForRemoval(child);
    });
    if (node.parent) {
      node.parent.removeChildNode(node);
    }
  }

  addConnectedCircle(rootCircle, mouseX, mouseY) {
    if (rootCircle.collapsed) return;
    this.stackManager.saveStateForUndo(this.getRootCircle());
    const distanceFromParentCircle = rootCircle.radius * 2.2;
    const deltaX = mouseX - rootCircle.x;
    const deltaY = mouseY - rootCircle.y;
    const angle = Math.atan2(deltaY, deltaX);
    const x = rootCircle.x + distanceFromParentCircle * Math.cos(angle);
    const y = rootCircle.y + distanceFromParentCircle * Math.sin(angle);
    const newCircle = new Circle(
      x,
      y,
      rootCircle.radius,
      CircleConstants.NODE_DEFAULT_NAME,
      rootCircle.fillColor
    );
    rootCircle.addChildNode(newCircle);
    this.addNode(newCircle);
  }

  selectNode(node) {
    if (this.selectedCircle === node) return;
    if (this.selectedCircle && this.originalColor) {
      this.selectedCircle.setFillColor(this.originalColor);
      this.selectedCircle.borderWidth =
        CircleConstants.BASE_CIRCLE_BORDER_WIDTH;
    }
    this.selectedCircle = node;
    this.originalColor = node.fillColor;
    this.selectedCircle.setFillColor(
      NodeColorHelper.lightenColor(this.selectedCircle.fillColor, 1.5)
    );
    this.selectedCircle.borderWidth =
      CircleConstants.SELECTED_CIRCLE_BORDER_WIDTH;
    this.drawNodes();
  }

  unselectNode() {
    if (!this.selectedCircle) return;
    this.selectedCircle.setFillColor(this.originalColor);
    this.selectedCircle.borderWidth = CircleConstants.BASE_CIRCLE_BORDER_WIDTH;
    this.selectedCircle = null;
    this.originalColor = null;
    this.drawNodes();
    console.log("Circle was unselected. Now it is:", this.selectedCircle);
  }

  renameSelectedNode(newText) {
    if (!this.selectedCircle) return;
    this.stackManager.saveStateForUndo(this.getRootCircle());
    this.selectedCircle.setText(newText);
    this.drawNodes();
  }

  renameSelectedNodePrompt() {
    const currentName = this.selectedCircle.text || "";
    const newName = prompt("Enter new name for the node:", currentName);
    if (newName) {
      this.renameSelectedNode(newName);
    }
  }

  randomizeSelectedNodeColor() {
    if (!this.selectedCircle) return;
    const randomColor = NodeColorHelper.getRandomLightColor();
    this.setSelectedCircleColor(randomColor);
  }

  getNodeColor(node) {
    return node.getFillColor();
  }

  setSelectedCircleColor(color) {
    if (!this.selectedCircle) return;
    this.stackManager.saveStateForUndo(this.getRootCircle());
    this.selectedCircle.setFillColor(color);
    this.originalColor = color;
    this.drawNodes();
  }

  updateCircleRadius(deltaY) {
    if (!this.selectedCircle) return;
    const delta = Math.sign(deltaY);
    const increment = delta * CircleConstants.DEFAULT_RADIUS_INCREMENT;
    const newRadius = this.selectedCircle.radius + increment;
    this.setSelectedCircleRadius(
      Math.max(newRadius, CircleConstants.MIN_CIRCLE_RADIUS)
    );
  }

  setSelectedCircleRadius(newRadius) {
    if (!this.selectedCircle) return;
    if (isNaN(newRadius) || newRadius <= 0) {
      console.error("invalid radius");
      return;
    }
    this.stackManager.saveStateForUndo(this.getRootCircle());
    this.selectedCircle.setRadius(newRadius);
    this.selectedCircle.actualiseText();
    this.drawNodes();
  }

  toggleSelectedCircleCollapse() {
    if (!this.selectedCircle || !this.selectedCircle.hasChildren()) return;
    this.stackManager.saveStateForUndo(this.getRootCircle());
    this.selectedCircle.toggleCollapse();
    this.drawNodes();
  }

  getRootCircle() {
    return this.nodes.find((circle) => circle.id === 0);
  }

  addRootCircleState() {
    const rootCircle = this.getRootCircle();
    this.stackManager.addRootCircleState(rootCircle);
  }

  saveStateForUndo() {
    this.stackManager.saveStateForUndo(this.getRootCircle());
  }

  undo() {
    this.stackManager.undo(this.getRootCircle(), this.restoreState.bind(this));
  }

  redo() {
    this.stackManager.redo(this.getRootCircle(), this.restoreState.bind(this));
  }

  restoreState(state) {
    this.resetAllNodes();
    const addNodeAndChildren = (circle) => {
      this.nodes.push(circle);
      circle.children.forEach(addNodeAndChildren);
    };
    addNodeAndChildren(state);
    this.drawNodes();
  }

  clearAllStacks() {
    this.stackManager.clearAllStacks();
  }
}
