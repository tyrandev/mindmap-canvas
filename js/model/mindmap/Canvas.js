import * as GlobalConstants from "../../constants/GlobalConstants.js";

//TODO: this should be able to get its center x and y
class Canvas {
  constructor() {
    if (Canvas.instance) {
      return Canvas.instance;
    }
    this.canvas = null;
    this.context = null;
    Canvas.instance = this;
    return this;
  }

  initializeCanvas() {
    if (!this.canvas) {
      this.canvas = document.getElementById(GlobalConstants.MINDMAP_CANVAS_ID);
      this.context = this.canvas.getContext("2d");
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
}

const instance = new Canvas();
export default instance;
