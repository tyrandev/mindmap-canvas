import Circle from "./Circle.js";

export default class CircleController {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.context = context;
    this.circles = [];
    this.selectedCircle = null;
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
    return this.circles.find((circle) => circle.isPointInside(x, y));
  }

  isCirclePressed(x, y) {
    return this.circles.find((circle) => circle.isPointInside(x, y)) || null;
  }

  moveCircle(circle, newX, newY) {
    circle.x = newX;
    circle.y = newY;
    this.drawCircles();
  }

  removeCircle(circle) {
    if (circle.id !== 0) {
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

  addConnectedCircle(motherCircle) {
    const distanceFromParentCircle = motherCircle.radius * 2.2;
    const angle = Math.random() * Math.PI * 2; // Random angle for positioning
    const x = motherCircle.x + distanceFromParentCircle * Math.cos(angle);
    const y = motherCircle.y + distanceFromParentCircle * Math.sin(angle);

    const newCircle = new Circle(x, y, motherCircle.radius); // Ensure new circle has same radius as parent
    motherCircle.addChildNode(newCircle);
    this.addCircle(newCircle);
  }

  selectCircle(circle) {
    if (this.selectedCircle === circle) return;
    if (this.selectedCircle) {
      this.selectedCircle.borderWidth = 1; // Reset previously selected circle's border
    }
    this.selectedCircle = circle;
    this.selectedCircle.borderWidth = 2; // Set border for newly selected circle
    this.drawCircles(); // Redraw circles to reflect selection
    console.log(this.selectedCircle, " was selected");
  }

  unselectCircle() {
    if (!this.selectedCircle) return;
    this.selectedCircle.borderWidth = 1; // Reset selected circle's border
    this.selectedCircle = null; // Unselect the circle
    this.drawCircles(); // Redraw circles to reflect unselection
    console.log("Circle was unselected");
  }
}
