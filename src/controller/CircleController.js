import Circle from "../model/geometric/circle/Circle.js";
import NodeColorHelper from "../model/geometric/node/helper/NodeColorHelper.js";
import * as CircleConstants from "../model/geometric/circle/CircleConstants.js";
import CircleStackManager from "./CircleStackManager.js";

export default class CircleController {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.context = context;
    this.circles = []; // it is used for checking if we click on circle
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
    this.addCircle(sampleCircle);
  }

  resetAllCircles() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.circles.forEach((circle) => (circle.toBeRemoved = true));
    this.circles = [];
    this.drawCircles();
  }

  addCircle(circle) {
    this.stackManager.saveStateForUndo(this.getRootCircle());
    this.circles.push(circle);
    this.drawCircles();
  }

  addCircleAndChildren(circle) {
    const addCircleRecursively = (circle) => {
      this.circles.push(circle);
      circle.children.forEach(addCircleRecursively);
    };
    addCircleRecursively(circle);
    this.drawCircles();
  }

  drawCircles() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.circles.forEach((circle) => circle.drawNodes(this.context));
  }

  getCircleAtPosition(x, y) {
    return this.circles.find((circle) => circle.isPointInsideOfNode(x, y));
  }

  moveCircle(circle, newX, newY) {
    const deltaX = newX - circle.x;
    const deltaY = newY - circle.y;
    if (
      Math.sqrt(deltaX ** 2 + deltaY ** 2) >=
      CircleConstants.DISTANCE_MOVED_TO_SAVE_STATE
    ) {
      this.stackManager.saveStateForUndo(this.getRootCircle());
      console.log("enough distance travelled for save state");
    }
    circle.x = newX;
    circle.y = newY;
    this.moveDescendants(circle, deltaX, deltaY);
    this.drawCircles();
  }

  moveDescendants(circle, deltaX, deltaY) {
    circle.children.forEach((child) => {
      child.x += deltaX;
      child.y += deltaY;
      this.moveDescendants(child, deltaX, deltaY);
    });
  }

  removeCircle(circle) {
    if (circle.id === 0) {
      console.log("Parent node cannot be removed", circle);
      return;
    }
    this.stackManager.saveStateForUndo(this.getRootCircle());
    this.selectedCircle = null;
    this.markCircleAndConnectionsForRemoval(circle);
    this.circles = this.circles.filter((c) => !c.toBeRemoved);
    this.drawCircles();
  }

  markCircleAndConnectionsForRemoval(circle) {
    circle.toBeRemoved = true;
    circle.children.forEach((child) => {
      this.markCircleAndConnectionsForRemoval(child);
    });
    if (circle.parent) {
      circle.parent.removeChildNode(circle);
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
      CircleConstants.CIRCLE_DEFAULT_NAME,
      rootCircle.fillColor
    );
    rootCircle.addChildNode(newCircle);
    this.addCircle(newCircle);
  }

  selectCircle(circle) {
    if (this.selectedCircle === circle) return;
    if (this.selectedCircle && this.originalColor) {
      this.selectedCircle.setFillColor(this.originalColor);
      this.selectedCircle.borderWidth = CircleConstants.BASE_CIRCLE_WIDTH;
    }
    this.selectedCircle = circle;
    this.originalColor = circle.fillColor;
    this.selectedCircle.setFillColor(
      NodeColorHelper.lightenColor(this.selectedCircle.fillColor, 1.5)
    );
    this.selectedCircle.borderWidth = CircleConstants.SELECTED_CIRCLE_WIDTH;
    this.drawCircles();
  }

  unselectCircle() {
    if (!this.selectedCircle) return;
    this.selectedCircle.setFillColor(this.originalColor);
    this.selectedCircle.borderWidth = CircleConstants.BASE_CIRCLE_WIDTH;
    this.selectedCircle = null;
    this.originalColor = null;
    this.drawCircles();
    console.log("Circle was unselected. Now it is:", this.selectedCircle);
  }

  renameSelectedCircle(newText) {
    if (!this.selectedCircle) return;
    this.stackManager.saveStateForUndo(this.getRootCircle());
    this.selectedCircle.setText(newText);
    this.drawCircles();
  }

  renameSelectedCirclePrompt() {
    const currentName = this.selectedCircle.text || "";
    const newName = prompt("Enter new name for the node:", currentName);
    if (newName) {
      this.renameSelectedCircle(newName);
    }
  }

  randomizeSelectedCircleColor() {
    if (!this.selectedCircle) return;
    const randomColor = NodeColorHelper.getRandomLightColor();
    this.setSelectedCircleColor(randomColor);
  }

  getCircleColor(circle) {
    return circle.getFillColor();
  }

  setSelectedCircleColor(color) {
    if (!this.selectedCircle) return;
    this.stackManager.saveStateForUndo(this.getRootCircle());
    this.selectedCircle.setFillColor(color);
    this.originalColor = color;
    this.drawCircles();
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
    this.drawCircles();
  }

  toggleSelectedCircleCollapse() {
    if (!this.selectedCircle || !this.selectedCircle.hasChildren()) return;
    this.stackManager.saveStateForUndo(this.getRootCircle());
    this.selectedCircle.toggleCollapse();
    this.drawCircles();
  }

  getRootCircle() {
    return this.circles.find((circle) => circle.id === 0);
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
    this.resetAllCircles();
    const addCircleAndChildren = (circle) => {
      this.circles.push(circle);
      circle.children.forEach(addCircleAndChildren);
    };
    addCircleAndChildren(state);
    this.drawCircles();
  }

  clearAllStacks() {
    this.stackManager.clearAllStacks();
  }
}
