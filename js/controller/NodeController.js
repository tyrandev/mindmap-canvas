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
import StackEventEmitter from "../event/StackEventEmitter.js";
import NodeContainer from "./NodeContainer.js";

export default class NodeController {
  constructor() {
    this.canvas = Canvas.getCanvas();
    this.context = Canvas.getContext();
    this.nodeContainer = new NodeContainer();
    this.mousePosition = MousePosition.getInstance();
    this.stackManager = new NodeStackManager(this.loadRootNode.bind(this));
    this.drawingEngine = new DrawingEngine(this.drawCanvasNodes.bind(this));
    this.nodeInitializer = new NodeInitializer(this);
    this.nodeInitializer.initRootNode();
    this.setupEventListeners();
  }

  clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  resetMindmap() {
    this.clearCanvas();
    this.nodeContainer.clearNodes();
    this.clearAllStacks();
    this.nodeInitializer.initRootNode();
    console.log("mindmap was reset");
  }

  resetAllNodes() {
    this.clearCanvas();
    this.nodeContainer.clearNodes();
  }

  addNode(node) {
    this.nodeContainer.addNode(node);
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

  addNodeAndChildren(node) {
    this.nodeContainer.addNodeAndChildren(node);
  }

  loadRootNode(rootNode) {
    this.resetAllNodes();
    this.nodeContainer.addNodeAndChildren(rootNode);
  }

  loadMindMap(rootNode) {
    this.loadRootNode(rootNode);
    this.moveRootNodeToCenter();
    this.clearAllStacks();
  }

  getNodeAtPosition(x, y) {
    return this.nodeContainer.getNodeAtPosition(x, y);
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

  getRootNode() {
    return this.nodeContainer.getRootNode();
  }

  moveRootNodeToCenter() {
    const rootNode = this.nodeContainer.getRootNode();
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
    this.nodeContainer.removeNodeAndChildren(node);
  }

  saveStateForUndo() {
    this.stackManager.saveStateForUndo(this.nodeContainer.getRootNode());
  }

  undo() {
    this.stackManager.undo(this.nodeContainer.getRootNode());
  }

  redo() {
    this.stackManager.redo(this.nodeContainer.getRootNode());
  }

  clearAllStacks() {
    this.stackManager.clearAllStacks();
  }

  drawCanvasNodes() {
    this.clearCanvas();
    this.nodeContainer
      .getNodes()
      .forEach((node) => node.drawNodes(this.context));
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

  setupEventListeners() {
    StackEventEmitter.on("saveStateForUndo", () => {
      this.saveStateForUndo();
    });

    StackEventEmitter.on("undo", () => {
      this.undo();
    });

    StackEventEmitter.on("redo", () => {
      this.redo();
    });

    StackEventEmitter.on("clearAllStacks", () => {
      this.clearAllStacks();
    });
  }
}
