import Circle from "./Circle.js";
import CircleColorHelper from "./helper/CircleColorHelper.js";
import * as CircleConstants from "./CircleConstants.js";

export default class CircleController {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.context = context;
    this.circles = []; // it is used for checking if we click on circle
    this.selectedCircle = null;
    this.originalColor = null;
    this.undoStack = [];
    this.redoStack = [];
    this.motherCircleState = [];
  }

  resetAllCircles() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.circles.forEach((circle) => (circle.toBeRemoved = true));
    this.circles = [];
    this.drawCircles();
  }

  addCircle(circle) {
    this.saveStateForUndo();
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
    return this.circles.find((circle) => circle.isPointInsideOfCircle(x, y));
  }

  moveCircle(circle, newX, newY) {
    const deltaX = newX - circle.x;
    const deltaY = newY - circle.y;

    if (
      Math.sqrt(deltaX ** 2 + deltaY ** 2) >=
      CircleConstants.DISTANCE_MOVED_TO_SAVE_STATE
    ) {
      this.saveStateForUndo();
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
    this.saveStateForUndo();
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

    this.saveStateForUndo();
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
    console.log(this.selectedCircle, " was selected");
  }

  unselectCircle() {
    if (!this.selectedCircle) return;
    this.saveStateForUndo();
    this.selectedCircle.setFillColor(this.originalColor);
    this.selectedCircle.borderWidth = CircleConstants.BASE_CIRCLE_WIDTH;
    this.selectedCircle = null;
    this.originalColor = null;
    this.drawCircles();
    console.log("Circle was unselected. Now it is:", this.selectedCircle);
  }

  renameSelectedCircle(newText) {
    if (!this.selectedCircle) return;
    this.saveStateForUndo();
    this.selectedCircle.setText(newText);
    this.drawCircles();
  }

  randomizeSelectedCircleColor() {
    if (!this.selectedCircle) return;
    this.saveStateForUndo();
    const randomColor = CircleColorHelper.getRandomLightColor();
    this.selectedCircle.setFillColor(randomColor);
    this.originalColor = randomColor;
    this.drawCircles();
  }

  updateCircleRadius(deltaY) {
    if (!this.selectedCircle) return;
    const delta = Math.sign(deltaY);
    const currentRadius = this.selectedCircle.radius;
    const newRadius =
      currentRadius + delta * CircleConstants.DEFAULT_RADIUS_INCREMENT;
    this.selectedCircle.radius = Math.max(
      newRadius,
      CircleConstants.MIN_CIRCLE_RADIUS
    );
    this.selectedCircle.actualiseText();
    this.drawCircles();
  }

  toggleSelectedCircleCollapse() {
    if (!this.selectedCircle) return;
    this.saveStateForUndo();
    this.selectedCircle.toggleCollapse();
    this.drawCircles();
  }

  getMotherCircle() {
    return this.circles.find((circle) => circle.id === 0);
  }

  addMotherCircleState() {
    const motherCircle = this.getMotherCircle();
    if (motherCircle) {
      this.motherCircleState.push(motherCircle.clone());
    }
    console.log(this.motherCircleState);
  }

  restoreMotherCircleState() {
    if (this.motherCircleState.length === 0) {
      console.log("No mother circle state to restore.");
      return;
    }
    const lastState = this.motherCircleState[this.motherCircleState.length - 1];
    this.resetAllCircles();
    const addCircleAndChildren = (circle) => {
      this.circles.push(circle);
      circle.children.forEach(addCircleAndChildren);
    };
    addCircleAndChildren(lastState);
    this.drawCircles();
  }

  saveStateForUndo() {
    const motherCircle = this.getMotherCircle();
    if (motherCircle) {
      this.undoStack.push(motherCircle.clone());
      this.redoStack = [];
    }
  }

  undo() {
    if (this.undoStack.length > 0) {
      const state = this.undoStack.pop();
      this.redoStack.push(this.getMotherCircle().clone());
      this.restoreState(state);
    }
  }

  redo() {
    if (this.redoStack.length > 0) {
      const state = this.redoStack.pop();
      this.undoStack.push(this.getMotherCircle().clone());
      this.restoreState(state);
    }
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
}
