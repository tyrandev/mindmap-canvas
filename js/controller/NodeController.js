import Node from "../model/geometric/node/Node.js";
import Circle from "../model/geometric/circle/Circle.js";
import * as CircleConstants from "../model/geometric/circle/CircleConstants.js";
import NodeStackManager from "./NodeStackManager.js";
import MousePosition from "../gui/mouse/MousePosition.js";
import NodeInitializer from "./NodeInitializer.js";
import NodeFactory from "../util/factory/NodeFactory.js";
import DrawingEngine from "../engine/DrawingEngine.js";
import Canvas from "../model/mindmap/Canvas.js";
import ScrollUtil from "../util/canvas/ScrollUtil.js";
import SelectionManager from "./SelectionManager.js";

export default class NodeController {
  constructor() {
    this.canvas = Canvas.getCanvas();
    this.context = Canvas.getContext();
    this.nodes = [];
    this.mousePosition = MousePosition.getInstance();
    this.stackManager = new NodeStackManager();
    this.nodeInitializer = new NodeInitializer(this);
    this.nodeInitializer.initRootNode();
    this.drawingEngine = new DrawingEngine(
      this.context,
      this.drawCanvasNodes.bind(this)
    );
    this.selectionManager = new SelectionManager(this.stackManager);
  }

  resetMindmap() {
    this.clearCanvas();
    this.nodes = [];
    this.clearAllStacks();
    this.nodeInitializer.initRootNode();
    console.log("mindmap was reset");
  }

  resetAllNodes() {
    this.clearCanvas();
    this.nodes = [];
  }

  addNode(node) {
    if (!(node instanceof Node)) {
      console.error("Following object is not a Node: ", node);
      return;
    }
    this.nodes.push(node);
  }

  addNodeAndChildren(node) {
    const addNodeRecursively = (node) => {
      this.nodes.push(node);
      node.children.forEach(addNodeRecursively);
    };
    addNodeRecursively(node);
  }

  loadRootNode(rootNode) {
    console.log("state: ", rootNode);
    this.resetAllNodes();
    const addNodeAndChildren = (node) => {
      this.nodes.push(node);
      node.children.forEach(addNodeAndChildren);
    };
    addNodeAndChildren(rootNode);
  }

  loadMindMap(rootNode) {
    this.loadRootNode(rootNode);
    this.moveRootNodeToCenter();
    this.clearAllStacks();
  }

  calculateDistanceFromParentNode(parentNode) {
    return parentNode instanceof Circle
      ? parentNode.radius * 2.2
      : parentNode.width * 1.25;
  }

  calculatePositionOfNewNode(parentNode, distanceFromParentNode) {
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
    this.saveStateForUndo();
    const distanceFromParentNode =
      this.calculateDistanceFromParentNode(parentNode);
    const { x, y } = this.calculatePositionOfNewNode(
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
    this.saveStateForUndo();
    const distanceFromParentNode =
      this.calculateDistanceFromParentNode(parentNode);
    const { x, y } = this.calculatePositionOfNewNode(
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
      this.saveStateForUndo();
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

  moveRootNodeToCenter() {
    const rootNode = this.getRootNode();
    if (!rootNode) {
      console.error("No root node found.");
      return;
    }
    const canvasCenter = Canvas.getCenterCoordinates();
    const offsetX = canvasCenter.x - rootNode.x;
    const offsetY = canvasCenter.y - rootNode.y;
    this.moveNode(rootNode, rootNode.x + offsetX, rootNode.y + offsetY);
    ScrollUtil.scrollToCenter();
  }

  removeNode(node) {
    if (node.id === 0) {
      console.log("Parent node cannot be removed", node);
      return;
    }
    this.saveStateForUndo();
    this.selectionManager.unselectNode(); // Unselect node before removing
    this.removeNodeAndChildren(node);
  }

  removeNodeAndChildren(nodeToRemove) {
    this.nodes = this.nodes.filter(
      (nodeToCheck) => !this.isNodeOrDescendant(nodeToCheck, nodeToRemove)
    );
    if (nodeToRemove.parent) {
      nodeToRemove.parent.removeChildNode(nodeToRemove);
    }
  }

  isNodeOrDescendant(candidate, node) {
    if (candidate === node) return true;
    for (let child of node.children) {
      if (this.isNodeOrDescendant(candidate, child)) return true;
    }
    return false;
  }

  selectNode(node) {
    this.selectionManager.selectNode(node, this.getRootNode());
  }

  unselectNode() {
    this.selectionManager.unselectNode();
  }

  renameSelectedNode(newText) {
    this.selectionManager.renameSelectedNode(newText, this.getRootNode());
  }

  renameSelectedNodePrompt() {
    this.selectionManager.renameSelectedNodePrompt();
  }

  randomizeSelectedNodeColor() {
    this.selectionManager.randomizeSelectedNodeColor(this.getRootNode());
  }

  setSelectedNodeColor(color) {
    this.selectionManager.setSelectedNodeColor(color, this.getRootNode());
  }

  updateSelectedNodeDimensions(deltaY) {
    this.selectionManager.updateSelectedNodeDimensions(
      deltaY,
      this.getRootNode()
    );
  }

  toggleSelectedNodeCollapse() {
    this.selectionManager.toggleSelectedNodeCollapse(this.getRootNode());
  }

  getRootNode() {
    return this.nodes.find((node) => node.id === 0);
  }

  saveStateForUndo() {
    this.stackManager.saveStateForUndo(this.getRootNode());
  }

  undo() {
    this.stackManager.undo(this.getRootNode(), this.loadRootNode.bind(this));
  }

  redo() {
    this.stackManager.redo(this.getRootNode(), this.loadRootNode.bind(this));
  }

  clearAllStacks() {
    this.stackManager.clearAllStacks();
  }
}
