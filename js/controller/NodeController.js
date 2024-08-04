import Circle from "../model/geometric/circle/Circle.js";
import Rectangle from "../model/geometric/rectangle/Rectangle.js";
import NodeColorHelper from "../model/geometric/node/helper/NodeColorHelper.js";
import * as CircleConstants from "../model/geometric/circle/CircleConstants.js";
import * as RectangleConstants from "../model/geometric/rectangle/RectangleConstants.js";
import NodeStackManager from "./NodeStackManager.js";
import MousePosition from "../gui/mouse/MousePosition.js";
import NodeInitializer from "./NodeInitializer.js";
import NodeFactory from "../util/factory/NodeFactory.js";
import DrawingEngine from "../engine/DrawingEngine.js";

export default class NodeController {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.context = context;
    this.nodes = [];
    this.selectedNode = null;
    this.originalNodeColor = null;
    this.mousePosition = MousePosition.getInstance();
    this.stackManager = new NodeStackManager();
    this.nodeInitializer = new NodeInitializer(this);
    this.nodeInitializer.initRootNode();
    this.drawingEngine = new DrawingEngine(
      this.context,
      this.drawCanvasNodes.bind(this)
    );
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
  }

  resetAllNodes() {
    this.clearCanvas();
    this.nodes.forEach((node) => (node.toBeRemoved = true));
    this.nodes = [];
  }

  addNode(node) {
    if (!node instanceof Node) return;
    this.stackManager.saveStateForUndo(this.getRootNode());
    this.nodes.push(node);
  }

  addNodeAndChildren(node) {
    const addNodeRecursively = (node) => {
      this.nodes.push(node);
      node.children.forEach(addNodeRecursively);
    };
    addNodeRecursively(node);
  }

  calculateDistanceFromParentNode(parentNode) {
    return parentNode instanceof Circle
      ? parentNode.radius * 2.2
      : parentNode.width * 1.25;
  }

  calculateNewNodePosition(parentNode, distanceFromParentNode) {
    const mouseX = this.mousePosition.getX();
    const mouseY = this.mousePosition.getY();
    const deltaX = mouseX - parentNode.x;
    const deltaY = mouseY - parentNode.y;
    const angle = Math.atan2(deltaY, deltaX);
    const x = parentNode.x + distanceFromParentNode * Math.cos(angle);
    const y = parentNode.y + distanceFromParentNode * Math.sin(angle);
    return { x, y };
  }

  addConnectedRectangle(parentNode) {
    if (parentNode.collapsed) return;
    this.stackManager.saveStateForUndo(this.getRootNode());
    const distanceFromParentNode =
      this.calculateDistanceFromParentNode(parentNode);
    const { x, y } = this.calculateNewNodePosition(
      parentNode,
      distanceFromParentNode
    );

    const newRectangle = NodeFactory.createRectangle(
      x,
      y,
      parentNode.getFillColor()
    );

    parentNode.addChildNode(newRectangle);
    this.addNode(newRectangle);
  }

  addConnectedCircle(parentNode) {
    if (parentNode.collapsed) return;
    this.stackManager.saveStateForUndo(this.getRootNode());
    const distanceFromParentNode =
      this.calculateDistanceFromParentNode(parentNode);
    const { x, y } = this.calculateNewNodePosition(
      parentNode,
      distanceFromParentNode
    );

    const newCircle = NodeFactory.createCircle(x, y, parentNode.getFillColor());
    parentNode.addChildNode(newCircle);
    this.addNode(newCircle);
  }

  clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawCanvasNodes() {
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

  selectNode(node) {
    if (this.selectedNode === node) return;
    if (this.selectedNode && this.originalNodeColor) {
      this.selectedNode.setFillColor(this.originalNodeColor);
      this.selectedNode.borderWidth = CircleConstants.BASE_CIRCLE_BORDER_WIDTH;
    }
    this.selectedNode = node;
    this.originalNodeColor = node.fillColor;
    this.selectedNode.setFillColor(
      NodeColorHelper.lightenColor(this.selectedNode.fillColor, 1.5)
    );
    this.selectedNode.borderWidth =
      CircleConstants.SELECTED_CIRCLE_BORDER_WIDTH;
  }

  unselectNode() {
    if (!this.selectedNode) return;
    this.selectedNode.setFillColor(this.originalNodeColor);
    this.selectedNode.borderWidth = CircleConstants.BASE_CIRCLE_BORDER_WIDTH;
    this.selectedNode = null;
    this.originalNodeColor = null;
    console.log("Node was unselected. Now it is:", this.selectedNode);
  }

  renameSelectedNode(newText) {
    if (!this.selectedNode) return;
    this.stackManager.saveStateForUndo(this.getRootNode());
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

  getNodeColor(node) {
    return node.getFillColor();
  }

  setSelectedNodeColor(color) {
    if (!this.selectedNode) return;
    this.stackManager.saveStateForUndo(this.getRootNode());
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

      // Ensure new dimensions do not fall below minimum values
      this.setSelectedRectangleDimensions(
        Math.max(newWidth, RectangleConstants.MIN_RECTANGLE_WIDTH),
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
  }

  toggleSelectedNodeCollapse() {
    if (!this.selectedNode || !this.selectedNode.hasChildren()) return;
    this.stackManager.saveStateForUndo(this.getRootNode());
    this.selectedNode.toggleCollapse();
  }

  getRootNode() {
    return this.nodes.find((node) => node.id === 0);
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
  }

  clearAllStacks() {
    this.stackManager.clearAllStacks();
  }
}
