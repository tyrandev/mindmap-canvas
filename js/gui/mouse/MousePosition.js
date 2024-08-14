import Canvas from "../../view/Canvas.js";

export default class MousePosition {
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
    this.canvas = Canvas.getCanvas();
    this.mouseX = 0;
    this.mouseY = 0;
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
  }

  handleMouseMove(event) {
    const coordinates = this.getMouseCoordinatesFromEvent(event);
    this.mouseX = coordinates.x;
    this.mouseY = coordinates.y;
  }

  getMouseCoordinatesFromEvent(event) {
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

  getMouseCoordinates() {
    return {
      x: this.mouseX,
      y: this.mouseY,
    };
  }

  getX() {
    return this.mouseX;
  }

  getY() {
    return this.mouseY;
  }
}
