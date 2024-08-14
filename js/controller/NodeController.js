import Circle from "../model/geometric/circle/Circle.js";
import * as CircleConstants from "../constants/CircleConstants.js";
import NodeStackManager from "./NodeStackManager.js";
import MousePosition from "../gui/mouse/MousePosition.js";
import RootNodeController from "./RootNodeController.js";
import NodeFactory from "../util/factory/NodeFactory.js";
import DrawingEngine from "../engine/DrawingEngine.js";
import Canvas from "../view/Canvas.js";
import ScrollUtil from "../util/canvas/ScrollUtil.js";
import StackEventEmitter from "../event/StackEventEmitter.js";

export default class NodeController {
  constructor(nodeContainer) {
    this.nodeContainer = nodeContainer;
    this.canvas = Canvas.getCanvas();
    this.context = Canvas.getContext();
    this.mousePosition = MousePosition.getInstance();
    this.stackManager = new NodeStackManager();
    this.drawingEngine = new DrawingEngine(this.nodeContainer);
    this.nodeInitializer = new RootNodeController(this);
    this.nodeInitializer.initRootNode();
    this.setupEventListeners();
  }

  putNodeIntoContainer(node) {
    this.nodeContainer.putNodeIntoContainer(node);
  }

  putNodeAndChildrenIntoContainer(node) {
    this.nodeContainer.putNodeAndChildrenIntoContainer(node);
  }

  getNodeAtPosition(x, y) {
    return this.nodeContainer.getNodeAtPosition(x, y);
  }

  removeNode(node) {
    this.saveStateForUndo();
    this.nodeContainer.removeNodeAndChildren(node);
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

  addConnectedNode(parentNode, nodeFactoryMethod) {
    if (parentNode.collapsed) return;
    this.saveStateForUndo();
    const distanceFromParentNode =
      this.calculateDistanceFromParentNode(parentNode);
    const { x, y } = this.calculatePositionOfNewNode(
      parentNode,
      distanceFromParentNode
    );
    const newNode = nodeFactoryMethod(x, y, parentNode.getFillColor());
    console.log(newNode);
    parentNode.addChildNode(newNode);
    this.putNodeIntoContainer(newNode);
  }

  addConnectedCircle(parentNode) {
    this.addConnectedNode(parentNode, NodeFactory.createCircle);
  }

  addConnectedRectangle(parentNode) {
    this.addConnectedNode(parentNode, NodeFactory.createRectangle);
  }

  resetAllNodes() {
    this.nodeContainer.clearNodes();
  }

  resetMindmap() {
    this.nodeContainer.clearNodes();
    this.stackManager.clearAllStacks();
    this.nodeInitializer.reinitializeRootNode();
    console.log("mindmap was reset");
  }

  loadRootNode(rootNode) {
    this.resetAllNodes();
    this.nodeContainer.putNodeAndChildrenIntoContainer(rootNode);
    this.stackManager.setCurrentState(rootNode);
  }

  loadMindMap(rootNode) {
    this.loadRootNode(rootNode);
    this.moveRootNodeToCenter();
    this.stackManager.clearAllStacks();
  }

  getRootNode() {
    return this.nodeInitializer.getRootNode();
  }

  moveRootNodeToCenter() {
    const rootNode = this.nodeInitializer.getRootNode();
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

  saveStateForUndo() {
    this.stackManager.setCurrentState(this.getRootNode());
    this.stackManager.saveStateForUndo();
  }

  undo() {
    const previousState = this.stackManager.undo();
    if (previousState) {
      this.loadRootNode(previousState);
    }
  }

  redo() {
    const nextState = this.stackManager.redo();
    if (nextState) {
      this.loadRootNode(nextState);
    }
  }

  clearAllStacks() {
    this.stackManager.clearAllStacks();
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
