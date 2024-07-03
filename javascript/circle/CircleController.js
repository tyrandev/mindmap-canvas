import Circle from "./Circle.js";
import CircleColorHelper from "./CircleColorHelper.js";

const DISTANCE_MOVED_TO_SAVE_STATE = 50;

export default class CircleController {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.context = context;
    this.circles = [];
    this.selectedCircle = null;
    this.originalColor = null;
    this.undoStack = [];
    this.redoStack = [];
    this.motherCircleState = []; // Initialize the motherCircleState array
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

  drawCircles() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.circles.forEach((circle) => circle.drawNodes(this.context));
  }

  getCircleAtPosition(x, y) {
    return this.circles.find((circle) => circle.isPointInsideOfCircle(x, y));
  }

  moveCircle(circle, newX, newY) {
    // Calculate the distance the circle will be moved
    const deltaX = newX - circle.x;
    const deltaY = newY - circle.y;

    // If the distance moved is greater than or equal to the threshold, save the state for undo
    if (Math.sqrt(deltaX ** 2 + deltaY ** 2) >= DISTANCE_MOVED_TO_SAVE_STATE) {
      this.saveStateForUndo();
      console.log("enough distance travelled for save state");
    }

    // Move the circle to the new position
    circle.x = newX;
    circle.y = newY;

    // Recursively move all descendant circles
    this.moveDescendants(circle, deltaX, deltaY);

    // Redraw all circles
    this.drawCircles();
  }

  moveDescendants(circle, deltaX, deltaY) {
    // Move each child circle by the deltaX and deltaY
    circle.children.forEach((child) => {
      child.x += deltaX;
      child.y += deltaY;
      this.moveDescendants(child, deltaX, deltaY); // Recursively move the descendants
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
    if (motherCircle.collapsed) {
      return;
    }

    this.saveStateForUndo();
    const distanceFromParentCircle = motherCircle.radius * 2.2;

    // Calculate angle from motherCircle center to mouse position
    const deltaX = mouseX - motherCircle.x;
    const deltaY = mouseY - motherCircle.y;
    const angle = Math.atan2(deltaY, deltaX);

    // Calculate new circle position based on angle and distance
    const x = motherCircle.x + distanceFromParentCircle * Math.cos(angle);
    const y = motherCircle.y + distanceFromParentCircle * Math.sin(angle);

    // Create the new circle
    const newCircle = new Circle(
      x,
      y,
      motherCircle.radius,
      "New node",
      motherCircle.fillColor
    );
    motherCircle.addChildNode(newCircle);
    this.addCircle(newCircle);
  }

  selectCircle(circle) {
    if (this.selectedCircle === circle) return;
    if (this.selectedCircle) {
      // Reset previously selected circle's fillColor
      if (this.originalColor) {
        this.selectedCircle.setFillColor(this.originalColor);
      }
      this.selectedCircle.borderWidth = 1;
    }
    this.selectedCircle = circle;
    this.originalColor = circle.fillColor; // Store the original color
    this.selectedCircle.setFillColor(
      CircleColorHelper.lightenColor(this.selectedCircle.fillColor, 1.5)
    );
    this.selectedCircle.borderWidth = 2;
    this.drawCircles();
    console.log(this.selectedCircle, " was selected");
  }

  unselectCircle() {
    if (!this.selectedCircle) return;
    this.saveStateForUndo();
    this.selectedCircle.setFillColor(this.originalColor); // Reset to the original color
    this.selectedCircle.borderWidth = 1; // Reset selected circle's border
    this.selectedCircle = null; // Unselect the circle
    this.originalColor = null; // Clear the stored original color
    this.drawCircles(); // Redraw circles to reflect unselection
    console.log("Circle was unselected. Now it is:", this.selectedCircle);
  }

  renameSelectedCircle(newText) {
    if (this.selectedCircle) {
      this.saveStateForUndo();
      this.selectedCircle.setText(newText);
      this.drawCircles();
    }
  }

  randomizeSelectedCircleColor() {
    if (this.selectedCircle) {
      this.saveStateForUndo();
      const randomColor = CircleColorHelper.getRandomLightColor();
      this.selectedCircle.setFillColor(randomColor);
      this.originalColor = randomColor;
      this.drawCircles();
    }
  }

  toggleSelectedCircleCollapse() {
    if (this.selectedCircle) {
      this.saveStateForUndo();
      this.selectedCircle.toggleCollapse();
      this.drawCircles();
    }
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

    // Clear current circles
    this.resetAllCircles();

    // Add the cloned last state and its children to the circles array
    const addCircleAndChildren = (circle) => {
      this.circles.push(circle);
      circle.children.forEach(addCircleAndChildren);
    };

    addCircleAndChildren(lastState);
    this.drawCircles();
  }

  // Undo and Redo functionality
  saveStateForUndo() {
    const motherCircle = this.getMotherCircle();
    if (motherCircle) {
      this.undoStack.push(motherCircle.clone()); // Ensure that the `collapsed` state is saved
      this.redoStack = []; // Clear redo stack when new action is performed
    }
  }

  undo() {
    if (this.undoStack.length > 0) {
      const state = this.undoStack.pop();
      this.redoStack.push(this.getMotherCircle().clone()); // Ensure that the `collapsed` state is saved for redo
      this.restoreState(state);
    }
  }

  redo() {
    if (this.redoStack.length > 0) {
      const state = this.redoStack.pop();
      this.undoStack.push(this.getMotherCircle().clone()); // Ensure that the `collapsed` state is saved for undo
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
