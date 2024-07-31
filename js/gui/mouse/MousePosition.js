import * as GlobalConstants from "../../constants/GlobalConstants.js";

class MousePosition {
  static instance = null;

  static getInstance() {
    if (!MousePosition.instance) {
      MousePosition.instance = new MousePosition();
    }
    return MousePosition.instance;
  }

  constructor() {
    if (MousePosition.instance) {
      throw new Error(
        "Use MousePosition.getInstance() to get the single instance of this class."
      );
    }

    this.canvas = document.getElementById(GlobalConstants.MINDMAP_CANVAS_ID);

    if (!this.canvas) {
      throw new Error(
        `Canvas element with ID ${GlobalConstants.MINDMAP_CANVAS_ID} not found.`
      );
    }

    this.mouseX = 0;
    this.mouseY = 0;

    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
  }

  handleMouseMove(event) {
    const coordinates = this.getMouseCoordinates(event);
    this.mouseX = coordinates.x;
    this.mouseY = coordinates.y;
  }

  getMouseCoordinates(event) {
    if (!event) {
      console.error("getMouseCoordinates called without event object");
      return { x: 0, y: 0 };
    }

    const rect = this.canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  getX() {
    return this.mouseX;
  }

  getY() {
    return this.mouseY;
  }
}

export default MousePosition;
