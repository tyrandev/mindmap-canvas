const DOUBLE_CLICK_THRESHOLD = 250;

export default class MouseHandler {
  constructor(mindMap) {
    this.mindMap = mindMap;
    this.circleController = mindMap.circleController;
    this.mouseDown = false;
    this.draggingCircle = null;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
    this.initMouseListeners();
  }

  initMouseListeners() {
    const canvas = this.mindMap.canvas;

    canvas.addEventListener("mousedown", this.handleCanvasMouseDown.bind(this));
    canvas.addEventListener("mousemove", this.handleCanvasMouseMove.bind(this));
    canvas.addEventListener("mouseup", this.handleCanvasMouseUp.bind(this));
    canvas.addEventListener("click", this.handleCanvasLeftClick.bind(this));
    canvas.addEventListener(
      "contextmenu",
      this.handleCanvasRightClick.bind(this)
    );
    canvas.addEventListener(
      "mouseleave",
      this.handleCanvasMouseLeave.bind(this)
    );
    canvas.addEventListener("wheel", this.handleCanvasMouseWheel.bind(this));
  }

  getMouseCoordinates(event) {
    const rect = this.mindMap.canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  handleCanvasMouseDown(event) {
    this.mouseDown = true;
    const { x, y } = this.getMouseCoordinates(event);
    const draggedCircle = this.circleController.getCircleAtPosition(x, y);

    if (!draggedCircle) {
      return;
    }

    this.draggingCircle = draggedCircle;
    this.dragOffsetX = draggedCircle.x - x;
    this.dragOffsetY = draggedCircle.y - y;

    // Update selected circle to the dragged circle
    if (this.circleController.selectedCircle !== draggedCircle) {
      this.circleController.selectCircle(draggedCircle);
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
    if (event.button !== 0) return;

    const { x, y } = this.getMouseCoordinates(event);
    const currentTime = performance.now();
    const timeSinceLastClick = currentTime - this.mindMap.lastLeftClickTime;
    const clickedCircle = this.circleController.getCircleAtPosition(x, y);

    // Check if the click qualifies as a double click based on proximity
    const isDoubleClick =
      timeSinceLastClick <= DOUBLE_CLICK_THRESHOLD &&
      Math.abs(x - this.mindMap.lastLeftClickX) <= 10 &&
      Math.abs(y - this.mindMap.lastLeftClickY) <= 10 &&
      clickedCircle !== null;

    if (isDoubleClick) {
      this.handleDoubleClick(clickedCircle, x, y);
      this.mindMap.lastLeftClickTime = 0;
      return;
    }

    this.handleSingleClick(clickedCircle, x, y, currentTime);
  }

  handleDoubleClick(clickedCircle, x, y) {
    this.mindMap.doubleClickTimer.start();
    if (clickedCircle) {
      console.log("Double click detected on circle", clickedCircle);
      this.circleController.addConnectedCircle(clickedCircle, x, y);
    } else {
      console.log("Position double clicked with left button:", x, y);
    }
  }

  handleSingleClick(clickedCircle, x, y, currentTime) {
    this.mindMap.lastLeftClickTime = currentTime;
    this.mindMap.lastLeftClickX = x;
    this.mindMap.lastLeftClickY = y;

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

  handleCanvasRightClick(event) {
    event.preventDefault();

    if (event.button !== 2) {
      return;
    }

    const { x, y } = this.getMouseCoordinates(event);
    const rightClickedCircle = this.circleController.getCircleAtPosition(x, y);

    this.handleSingleRightClick(rightClickedCircle, x, y);
  }

  handleSingleRightClick(rightClickedCircle, x, y) {
    if (rightClickedCircle) {
      console.log("Circle clicked with right button!", rightClickedCircle);
    } else {
      console.log("Position clicked with right button:", x, y);
    }
  }

  handleCanvasMouseLeave(event) {
    this.mouseDown = false;
    this.draggingCircle = null;
  }

  handleCanvasMouseWheel(event) {
    if (!this.circleController.selectedCircle) {
      return;
    }
    event.preventDefault();
    this.circleController.updateCircleRadius(event.deltaY);
  }
}
