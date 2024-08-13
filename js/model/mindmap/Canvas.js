import * as GlobalConstants from "../../constants/GlobalConstants.js";

class Canvas {
  constructor() {
    if (Canvas.instance) {
      return Canvas.instance;
    }
    this.canvas = null;
    this.context = null;
    this.initializeCanvas();
    Canvas.instance = this;
    return this;
  }

  initializeCanvas() {
    if (!this.canvas) {
      this.canvas = document.getElementById(GlobalConstants.MINDMAP_CANVAS_ID);
      this.context = this.canvas.getContext("2d");
      // Ensure canvas can receive focus
      this.canvas.setAttribute("tabindex", "0");
    }
  }

  setCanvasSize(width, height) {
    if (!this.canvas) {
      console.error("Canvas has not been initialized.");
      return;
    }

    const ratio = window.devicePixelRatio || 1;
    const style = this.canvas.style;
    style.width = `${width}px`;
    style.height = `${height}px`;
    this.canvas.width = width * ratio;
    this.canvas.height = height * ratio;
    this.context.scale(ratio, ratio);
  }

  getCanvas() {
    if (!this.canvas) {
      console.error("Canvas has not been initialized.");
    }
    return this.canvas;
  }

  getContext() {
    if (!this.context) {
      console.error("Canvas context has not been initialized.");
    }
    return this.context;
  }

  getCenterCoordinates() {
    if (!this.canvas) {
      console.error("Canvas has not been initialized.");
      return { x: 0, y: 0 };
    }
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: rect.width / 2,
      y: rect.height / 2,
    };
  }
}

const instance = new Canvas();
export default instance;
