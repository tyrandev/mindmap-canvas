import MillisecondTimer from "./MillisecondTimer.js";
import Circle from "./circle/Circle.js";
import CircleController from "./circle/CircleController.js";

export default class MindMap {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext("2d");
    this.circleController = new CircleController(this.canvas, this.context);
    this.mouseDown = false;
    this.doubleClickTimer = new MillisecondTimer();

    this.lastLeftClickTime = 0;
    this.doubleClickThreshold = 250;
    this.lastLeftClickX = 0;
    this.lastLeftClickY = 0;

    this.canvas.addEventListener(
      "mousedown",
      this.handleCanvasMouseDown.bind(this)
    );
    this.canvas.addEventListener(
      "mousemove",
      this.handleCanvasMouseMove.bind(this)
    );
    this.canvas.addEventListener(
      "mouseup",
      this.handleCanvasMouseUp.bind(this)
    );
    this.canvas.addEventListener(
      "click",
      this.handleCanvasLeftClick.bind(this)
    );
    this.canvas.addEventListener(
      "contextmenu",
      this.handleCanvasRightClick.bind(this)
    );
    this.canvas.addEventListener(
      "mouseleave",
      this.handleCanvasMouseLeave.bind(this)
    );
  }

  initialiseParentCircle() {
    const sampleCircle = new Circle();
    this.circleController.addCircle(sampleCircle);
  }

  addCircle(x, y, radius, text) {
    const circle = new Circle(x, y, radius, text);
    this.circleController.addCircle(circle);
  }

  drawCircles() {
    this.circleController.drawCircles();
  }

  handleCanvasMouseDown(event) {
    this.mouseDown = true;
    const { x, y } = this.getMouseCoordinates(event);
    const draggedCircle = this.circleController.getCircleAtPosition(x, y);

    if (draggedCircle) {
      this.draggingCircle = draggedCircle;
      this.dragOffsetX = draggedCircle.x - x;
      this.dragOffsetY = draggedCircle.y - y;

      // Update selected circle to the dragged circle
      if (this.circleController.selectedCircle !== draggedCircle) {
        this.circleController.selectCircle(draggedCircle);
      }
    }
  }

  handleCanvasMouseMove(event) {
    if (this.mouseDown && this.draggingCircle) {
      const { x, y } = this.getMouseCoordinates(event);
      this.circleController.moveCircle(
        this.draggingCircle,
        x + this.dragOffsetX,
        y + this.dragOffsetY
      );
    }
  }

  handleCanvasMouseUp(event) {
    this.mouseDown = false;
    this.draggingCircle = null;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
  }

  handleCanvasLeftClick(event) {
    if (event.button === 0) {
      const { x, y } = this.getMouseCoordinates(event);
      const currentTime = performance.now();
      const timeSinceLastClick = currentTime - this.lastLeftClickTime;
      const clickedCircle = this.circleController.getCircleAtPosition(x, y);

      // Check if the click qualifies as a double click based on proximity
      const isDoubleClick =
        timeSinceLastClick <= this.doubleClickThreshold &&
        Math.abs(x - this.lastLeftClickX) <= 10 &&
        Math.abs(y - this.lastLeftClickY) <= 10 &&
        clickedCircle !== null;

      if (isDoubleClick) {
        this.doubleClickTimer.start();
        if (clickedCircle) {
          console.log("Double click detected on circle", clickedCircle);
          // Add connected circle near mouse position
          this.circleController.addConnectedCircle(clickedCircle, x, y);
        } else {
          console.log("Position double clicked with left button:", x, y);
        }
        this.lastLeftClickTime = 0; // Reset last click time
        return;
      }

      this.lastLeftClickTime = currentTime;
      this.lastLeftClickX = x; // Store current click position
      this.lastLeftClickY = y;

      if (
        this.circleController.selectedCircle &&
        this.circleController.selectedCircle !== clickedCircle
      ) {
        this.circleController.unselectCircle();
      }

      if (clickedCircle) {
        console.log("Circle clicked with left button!", clickedCircle);
        this.circleController.selectCircle(clickedCircle);
      } else {
        console.log("Position clicked with left button:", x, y);
        this.circleController.unselectCircle();
      }
    }
  }

  handleCanvasRightClick(event) {
    event.preventDefault();
    if (event.button === 2) {
      const { x, y } = this.getMouseCoordinates(event);
      const rightClickedCircle = this.circleController.getCircleAtPosition(
        x,
        y
      );
      if (rightClickedCircle) {
        console.log("Circle clicked with right button!", rightClickedCircle);
        this.circleController.removeCircle(rightClickedCircle);
      } else {
        console.log("Position clicked with right button:", x, y);
      }
    }
  }

  handleCanvasMouseLeave(event) {
    this.mouseDown = false;
    this.draggingCircle = null;
  }

  getMouseCoordinates(event) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }
}
