import Circle from "./Circle.js";
import CircleColorHelper from "./CircleColorHelper.js";

export default class CircleController {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.context = context;
    this.circles = [];
    this.selectedCircle = null;
    this.originalColor = null;
  }

  // New method to clear the circles and draw them
  resetAllCircles() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.circles.forEach((circle) => (circle.toBeRemoved = true));
    this.circles = [];
    this.drawCircles();
  }

  addCircle(circle) {
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
    const distance = Math.sqrt((newX - circle.x) ** 2 + (newY - circle.y) ** 2);

    circle.x = newX;
    circle.y = newY;

    this.drawCircles();
  }

  removeCircle(circle) {
    if (circle.id !== 0) {
      this.selectedCircle = null;
      this.markCircleAndConnectionsForRemoval(circle);
      this.circles = this.circles.filter((c) => !c.toBeRemoved);
      this.drawCircles();
    } else {
      console.log("Parent node cannot be removed", circle);
    }
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
      this.selectedCircle.borderWidth = 1; // Reset previously selected circle's border
    }
    this.selectedCircle = circle;
    this.originalColor = circle.fillColor; // Store the original color
    this.selectedCircle.setFillColor(
      CircleColorHelper.darkenColor(this.selectedCircle.fillColor, 1.5)
    ); // Darken the current color of the circle
    this.selectedCircle.borderWidth = 2; // Set border for newly selected circle
    this.drawCircles(); // Redraw circles to reflect selection
    console.log(this.selectedCircle, " was selected");
  }

  unselectCircle() {
    if (!this.selectedCircle) return;
    this.selectedCircle.setFillColor(this.originalColor); // Reset to the original color
    this.selectedCircle.borderWidth = 1; // Reset selected circle's border
    this.selectedCircle = null; // Unselect the circle
    this.originalColor = null; // Clear the stored original color
    this.drawCircles(); // Redraw circles to reflect unselection
    console.log("Circle was unselected. Now it is:", this.selectedCircle);
  }

  renameSelectedCircle(newText) {
    if (this.selectedCircle) {
      this.selectedCircle.setText(newText);
      this.drawCircles();
    }
  }

  randomizeSelectedCircleColor() {
    if (this.selectedCircle) {
      const randomColor = CircleColorHelper.getRandomLightColor();
      this.selectedCircle.setFillColor(randomColor);
      this.originalColor = randomColor;
      this.drawCircles();
    }
  }
}
