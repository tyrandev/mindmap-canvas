import Circle from "./Circle.js";
import CircleColorHelper from "./helper/CircleColorHelper.js";
import * as CircleConstants from "./CircleConstants.js";
import CircleStackManager from "./CircleStackManager.js";

export default class CircleController {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.context = context;
    this.circles = [];
    this.selectedCircle = null;
    this.originalColor = null;
    this.stackManager = new CircleStackManager();
    this.zoomLevel = 1;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  resetAllCircles() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.circles.forEach((circle) => (circle.toBeRemoved = true));
    this.circles = [];
    this.drawCircles();
  }

  addCircle(circle) {
    this.stackManager.saveStateForUndo(this.getMotherCircle());
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
    this.context.save();
    this.context.translate(this.offsetX, this.offsetY);
    this.context.scale(this.zoomLevel, this.zoomLevel);
    this.circles.forEach((circle) => circle.drawNodes(this.context));
    this.context.restore();
  }

  getCircleAtPosition(x, y) {
    const adjustedX = (x - this.offsetX) / this.zoomLevel;
    const adjustedY = (y - this.offsetY) / this.zoomLevel;
    return this.circles.find((circle) =>
      circle.isPointInsideOfCircle(adjustedX, adjustedY)
    );
  }

  moveCircle(circle, newX, newY) {
    // Adjust the new positions based on the current zoom level
    const adjustedNewX = (newX - this.offsetX) / this.zoomLevel;
    const adjustedNewY = (newY - this.offsetY) / this.zoomLevel;

    const deltaX = adjustedNewX - circle.x;
    const deltaY = adjustedNewY - circle.y;

    if (
      Math.sqrt(deltaX ** 2 + deltaY ** 2) >=
      CircleConstants.DISTANCE_MOVED_TO_SAVE_STATE
    ) {
      this.stackManager.saveStateForUndo(this.getMotherCircle());
      console.log("enough distance travelled for save state");
    }

    circle.x = adjustedNewX;
    circle.y = adjustedNewY;
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
    this.stackManager.saveStateForUndo(this.getMotherCircle());
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

  addConnectedCircle(motherCircle, mouseX, mouseY) {
    if (motherCircle.collapsed) return;
    this.stackManager.saveStateForUndo(this.getMotherCircle());
    const distanceFromParentCircle = motherCircle.radius * 2.2;
    const deltaX = mouseX - motherCircle.x;
    const deltaY = mouseY - motherCircle.y;
    const angle = Math.atan2(deltaY, deltaX);
    const x = motherCircle.x + distanceFromParentCircle * Math.cos(angle);
    const y = motherCircle.y + distanceFromParentCircle * Math.sin(angle);
    const newCircle = new Circle(
      x,
      y,
      motherCircle.radius,
      CircleConstants.CIRCLE_DEFAULT_NAME,
      motherCircle.fillColor
    );
    motherCircle.addChildNode(newCircle);
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
      CircleColorHelper.lightenColor(this.selectedCircle.fillColor, 1.5)
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
    this.stackManager.saveStateForUndo(this.getMotherCircle());
    this.selectedCircle.setText(newText);
    this.drawCircles();
  }

  renameSelectedCirclePrompt() {
    const newName = prompt(
      "Enter new name for the node:",
      this.selectCircle.text
    );
    if (newName) {
      this.renameSelectedCircle(newName);
    }
  }

  randomizeSelectedCircleColor() {
    if (!this.selectedCircle) return;
    const randomColor = CircleColorHelper.getRandomLightColor();
    this.setSelectedCircleColor(randomColor);
  }

  getCircleColor(circle) {
    return circle.getFillColor();
  }

  setSelectedCircleColor(color) {
    if (!this.selectedCircle) return;
    this.stackManager.saveStateForUndo(this.getMotherCircle());
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
    this.stackManager.saveStateForUndo(this.getMotherCircle());
    this.selectedCircle.setRadius(newRadius);
    this.selectedCircle.actualiseText();
    this.drawCircles();
  }

  toggleSelectedCircleCollapse() {
    if (!this.selectedCircle || !this.selectedCircle.hasChildren()) return;
    this.stackManager.saveStateForUndo(this.getMotherCircle());
    this.selectedCircle.toggleCollapse();
    this.drawCircles();
  }

  getMotherCircle() {
    return this.circles.find((circle) => circle.id === 0);
  }

  addMotherCircleState() {
    const motherCircle = this.getMotherCircle();
    this.stackManager.addMotherCircleState(motherCircle);
  }

  saveStateForUndo() {
    this.stackManager.saveStateForUndo(this.getMotherCircle());
  }

  undo() {
    this.stackManager.undo(
      this.getMotherCircle(),
      this.restoreState.bind(this)
    );
  }

  redo() {
    this.stackManager.redo(
      this.getMotherCircle(),
      this.restoreState.bind(this)
    );
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

  zoomIn() {
    this.adjustZoom(1.1);
  }

  zoomOut() {
    this.adjustZoom(1 / 1.1);
  }

  adjustZoom(zoomFactor) {
    const prevZoomLevel = this.zoomLevel;
    this.zoomLevel *= zoomFactor;

    // Center coordinates in the canvas
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    // Adjust offsets to ensure circles remain in place relative to the center of the canvas
    this.offsetX =
      centerX - (centerX - this.offsetX) * (this.zoomLevel / prevZoomLevel);
    this.offsetY =
      centerY - (centerY - this.offsetY) * (this.zoomLevel / prevZoomLevel);

    console.log("Current Zoom Level:", this.zoomLevel);

    this.drawCircles();
  }
}
