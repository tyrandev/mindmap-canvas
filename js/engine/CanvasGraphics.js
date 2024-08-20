import Canvas from "../view/Canvas.js";

export default class CanvasGraphics {
  constructor() {
    this.context = Canvas.getContext();
    this.canvas = Canvas.getCanvas();
  }

  clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  getContext() {
    return this.context;
  }

  getCanvas() {
    return this.canvas;
  }
}
