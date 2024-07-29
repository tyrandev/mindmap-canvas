import Circle from "../model/geometric/circle/Circle.js";
import Rectangle from "../model/geometric/rectangle/Rectangle.js";
import NodeColorHelper from "../model/geometric/node/helper/NodeColorHelper.js";
import * as CircleConstants from "../model/geometric/circle/CircleConstants.js";
import * as RectangleConstants from "../model/geometric/rectangle/RectangleConstants.js";
import NodeStackManager from "./NodeStackManager.js";

export default class NodeController {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.context = context;
    this.nodes = [];
    this.selectedNode = null;
    this.originalColor = null;
    this.stackManager = new NodeStackManager();
    this.initRootNode();
  }

  initRootNode(initialText = "Mindmap") {
    this.initRootRectangle();
  }

  initRootCircle(initialText = "Mindmap") {
    const rootNode = new Circle(
      1335,
      860,
      CircleConstants.BASE_CIRCLE_RADIUS,
      initialText
    );
    this.addNode(rootNode);
  }

  initRootRectangle(initialText = "Mindmap") {
    const rootNode = new Rectangle(
      1335,
      860,
      RectangleConstants.BASE_RECTANGLE_WIDTH,
      RectangleConstants.BASE_RECTANGLE_HEIGHT,
      initialText
    );
    this.addNode(rootNode);
  }

  addConnectedRectangle(rootNode, mouseX, mouseY) {
    if (rootNode.collapsed) return;
    this.stackManager.saveStateForUndo(this.getRootNode());
    const distanceFromParentNode =
      Math.max(rootNode.width, rootNode.height) * 2.2;
    const deltaX = mouseX - rootNode.x;
    const deltaY = mouseY - rootNode.y;
    const angle = Math.atan2(deltaY, deltaX);
    const x = rootNode.x + distanceFromParentNode * Math.cos(angle);
    const y = rootNode.y + distanceFromParentNode * Math.sin(angle);
    const newRectangle = new Rectangle(
      x,
      y,
      RectangleConstants.BASE_RECTANGLE_WIDTH,
      RectangleConstants.BASE_RECTANGLE_HEIGHT,
      RectangleConstants.NODE_DEFAULT_NAME,
      rootNode.fillColor
    );
    rootNode.addChildNode(newRectangle);
    this.addNode(newRectangle);
  }

  setSelectedRectangleDimensions(newWidth, newHeight) {
    if (!(this.selectedNode instanceof Rectangle)) return;
    if (
      isNaN(newWidth) ||
      newWidth <= 0 ||
      isNaN(newHeight) ||
      newHeight <= 0
    ) {
      console.error("invalid dimensions");
      return;
    }
    this.stackManager.saveStateForUndo(this.getRootNode());
    this.selectedNode.setDimensions(newWidth, newHeight);
    this.selectedNode.actualiseText();
    this.drawNodes();
  }

  clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  resetAllNodes() {
    this.clearCanvas();
    this.nodes.forEach((node) => (node.toBeRemoved = true));
    this.nodes = [];
    this.drawNodes();
  }

  addNode(node) {
    if (!node instanceof Node) return;
    this.stackManager.saveStateForUndo(this.getRootNode());
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
      this.stackManager.saveStateForUndo(this.getRootNode());
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
    this.stackManager.saveStateForUndo(this.getRootNode());
    this.selectedNode = null;
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

  addConnectedNode(rootNode, mouseX, mouseY) {
    if (rootNode.collapsed) return;
    this.stackManager.saveStateForUndo(this.getRootNode());
    const distanceFromParentNode =
      (rootNode instanceof Circle
        ? rootNode.radius
        : Math.max(rootNode.width, rootNode.height)) * 1.25;
    const deltaX = mouseX - rootNode.x;
    const deltaY = mouseY - rootNode.y;
    const angle = Math.atan2(deltaY, deltaX);
    const x = rootNode.x + distanceFromParentNode * Math.cos(angle);
    const y = rootNode.y + distanceFromParentNode * Math.sin(angle);

    let newNode;
    if (rootNode instanceof Circle) {
      newNode = new Circle(
        x,
        y,
        rootNode.radius,
        CircleConstants.NODE_DEFAULT_NAME,
        rootNode.fillColor
      );
    } else {
      newNode = new Rectangle(
        x,
        y,
        RectangleConstants.BASE_RECTANGLE_WIDTH,
        RectangleConstants.BASE_RECTANGLE_HEIGHT,
        RectangleConstants.NODE_DEFAULT_NAME,
        rootNode.fillColor
      );
    }

    rootNode.addChildNode(newNode);
    this.addNode(newNode);
  }

  selectNode(node) {
    if (this.selectedNode === node) return;
    if (this.selectedNode && this.originalColor) {
      this.selectedNode.setFillColor(this.originalColor);
      this.selectedNode.borderWidth = CircleConstants.BASE_CIRCLE_BORDER_WIDTH;
    }
    this.selectedNode = node;
    this.originalColor = node.fillColor;
    this.selectedNode.setFillColor(
      NodeColorHelper.lightenColor(this.selectedNode.fillColor, 1.5)
    );
    this.selectedNode.borderWidth =
      CircleConstants.SELECTED_CIRCLE_BORDER_WIDTH;
    this.drawNodes();
  }

  unselectNode() {
    if (!this.selectedNode) return;
    this.selectedNode.setFillColor(this.originalColor);
    this.selectedNode.borderWidth = CircleConstants.BASE_CIRCLE_BORDER_WIDTH;
    this.selectedNode = null;
    this.originalColor = null;
    this.drawNodes();
    console.log("Node was unselected. Now it is:", this.selectedNode);
  }

  renameSelectedNode(newText) {
    if (!this.selectedNode) return;
    this.stackManager.saveStateForUndo(this.getRootNode());
    this.selectedNode.setText(newText);
    this.drawNodes();
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

  getNodeColor(node) {
    return node.getFillColor();
  }

  setSelectedNodeColor(color) {
    if (!this.selectedNode) return;
    this.stackManager.saveStateForUndo(this.getRootNode());
    this.selectedNode.setFillColor(color);
    this.originalColor = color;
    this.drawNodes();
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
      this.setSelectedRectangleDimensions(
        Math.max(newWidth, RectangleConstants.MIN_RECTANGLE_WIDTH * 2),
        Math.max(newHeight, RectangleConstants.MIN_RECTANGLE_HEIGHT)
      );
    }
  }

  setSelectedCircleRadius(newRadius) {
    if (!(this.selectedNode instanceof Circle)) return;
    if (isNaN(newRadius) || newRadius <= 0) {
      console.error("invalid radius");
      return;
    }
    this.stackManager.saveStateForUndo(this.getRootNode());
    this.selectedNode.setRadius(newRadius);
    this.selectedNode.actualiseText();
    this.drawNodes();
  }

  toggleSelectedNodeCollapse() {
    if (!this.selectedNode || !this.selectedNode.hasChildren()) return;
    this.stackManager.saveStateForUndo(this.getRootNode());
    this.selectedNode.toggleCollapse();
    this.drawNodes();
  }

  getRootNode() {
    return this.nodes.find((node) => node.id === 0);
  }

  addRootNodeState() {
    const rootNode = this.getRootNode();
    this.stackManager.addRootNodeState(rootNode);
  }

  saveStateForUndo() {
    this.stackManager.saveStateForUndo(this.getRootNode());
  }

  undo() {
    this.stackManager.undo(this.getRootNode(), this.restoreState.bind(this));
  }

  redo() {
    this.stackManager.redo(this.getRootNode(), this.restoreState.bind(this));
  }

  restoreState(state) {
    this.resetAllNodes();
    const addNodeAndChildren = (node) => {
      this.nodes.push(node);
      node.children.forEach(addNodeAndChildren);
    };
    addNodeAndChildren(state);
    this.drawNodes();
  }

  clearAllStacks() {
    this.stackManager.clearAllStacks();
  }
}
