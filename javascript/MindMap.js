import MillisecondTimer from "./MillisecondTimer.js";
import Circle from "./circle/Circle.js";
import CircleController from "./circle/CircleController.js";
import MindMapFileHandler from "./MindMapFileHandler.js";
import CircleSerializer from "./circle/CircleSerializer.js";

const DOUBLE_CLICK_THRESHOLD = 250;
const MIN_CIRCLE_RADIUS = 30;
const DEFAULT_RADIUS_INCREMENT = 1.25;

export default class MindMap {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext("2d");
    this.circleController = new CircleController(this.canvas, this.context);
    this.fileHandler = new MindMapFileHandler(this.circleController);
    this.mouseDown = false;
    this.doubleClickTimer = new MillisecondTimer();

    this.lastLeftClickTime = 0;
    this.lastLeftClickX = 0;
    this.lastLeftClickY = 0;

    this.canvas.addEventListener("keydown", this.handleKeyDown.bind(this));
    this.canvas.setAttribute("tabindex", "0"); // Ensure canvas can receive focus

    this.canvas.addEventListener(
      "wheel",
      this.handleCanvasMouseWheel.bind(this)
    );

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

    // Add file input element for loading JSON
    this.fileInput = document.createElement("input");
    this.fileInput.type = "file";
    this.fileInput.accept = ".json";
    this.fileInput.style.display = "none";
    this.fileInput.addEventListener(
      "change",
      this.fileHandler.loadFromJson.bind(this.fileHandler)
    );
    document.body.appendChild(this.fileInput);
  }

  initialiseParentCircle(initialText) {
    const sampleCircle = new Circle(1335, 860, 50, initialText);
    this.circleController.addCircle(sampleCircle);
  }

  drawCircles() {
    this.circleController.drawCircles();
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
    if (event.button !== 0) {
      return;
    }

    const { x, y } = this.getMouseCoordinates(event);
    const currentTime = performance.now();
    const timeSinceLastClick = currentTime - this.lastLeftClickTime;
    const clickedCircle = this.circleController.getCircleAtPosition(x, y);

    // Check if the click qualifies as a double click based on proximity
    const isDoubleClick =
      timeSinceLastClick <= DOUBLE_CLICK_THRESHOLD &&
      Math.abs(x - this.lastLeftClickX) <= 10 &&
      Math.abs(y - this.lastLeftClickY) <= 10 &&
      clickedCircle !== null;

    if (isDoubleClick) {
      this.handleDoubleClick(clickedCircle, x, y);
      this.lastLeftClickTime = 0;
      return;
    }

    this.handleSingleClick(clickedCircle, x, y, currentTime);
  }

  handleDoubleClick(clickedCircle, x, y) {
    this.doubleClickTimer.start();
    if (clickedCircle) {
      console.log("Double click detected on circle", clickedCircle);
      this.circleController.addConnectedCircle(clickedCircle, x, y);
    } else {
      console.log("Position double clicked with left button:", x, y);
    }
  }

  handleSingleClick(clickedCircle, x, y, currentTime) {
    this.lastLeftClickTime = currentTime;
    this.lastLeftClickX = x;
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

  getMouseCoordinates(event) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  handleKeyDown(event) {
    console.log("Key pressed:", event.key);

    if (event.key === "z" && event.ctrlKey) {
      event.preventDefault();
      this.circleController.undo();
    }

    if (event.key === "y" && event.ctrlKey) {
      event.preventDefault();
      this.circleController.redo();
    }

    if (event.key === "F3" && this.circleController.selectedCircle) {
      event.preventDefault();
      this.circleController.toggleSelectedCircleCollapse();
    }

    if (event.key === "F2" && this.circleController.selectedCircle) {
      console.log("F2 pressed and circle selected");
      event.preventDefault();
      const newName = prompt("Enter new name for the circle:");
      if (newName !== null) {
        this.circleController.renameSelectedCircle(newName);
      }
    }

    if ((event.ctrlKey || event.metaKey) && event.key === "s") {
      event.preventDefault();
      this.fileHandler.saveToJson();
    }

    if ((event.ctrlKey || event.metaKey) && event.key === "o") {
      event.preventDefault();
      this.fileInput.click();
    }

    if (
      (event.key === "Backspace" || event.key === "Delete") &&
      this.circleController.selectedCircle
    ) {
      console.log("Backspace/Delete pressed and circle selected");
      event.preventDefault();
      this.circleController.removeCircle(this.circleController.selectedCircle);
    }

    if (event.key === "Tab" && this.circleController.selectedCircle) {
      console.log("Tab pressed and circle selected");
      event.preventDefault();
      this.circleController.randomizeSelectedCircleColor();
    }

    if (event.key === "Escape" && this.circleController.selectedCircle) {
      console.log("Escape pressed and circle selected");
      event.preventDefault();
      this.circleController.unselectCircle();
    }

    // Add key to save to local storage (Ctrl + L)
    if ((event.ctrlKey || event.metaKey) && event.key === "l") {
      event.preventDefault();
      const filename = prompt("Enter the name to save the mind map:");
      if (filename) {
        const rootCircle = this.circleController.getMotherCircle();
        const json = CircleSerializer.serialize(rootCircle);
        this.fileHandler.saveToLocalStorage(filename, json);
      }
    }

    // Add key to show mind maps in local storage (Ctrl + M)
    if ((event.ctrlKey || event.metaKey) && event.key === "m") {
      event.preventDefault();
      const savedMindMaps = this.fileHandler.listSavedMindMaps();
      alert("Saved mind maps:\n" + savedMindMaps.join("\n"));
    }

    // Add key to load from local storage (Ctrl + Shift + L)
    if (event.ctrlKey && event.shiftKey && event.key === "L") {
      event.preventDefault();
      const savedMindMaps = this.fileHandler.listSavedMindMaps();
      const selectedMap = prompt(
        "Enter the name of the mind map to load:",
        savedMindMaps.join(", ")
      );
      if (selectedMap) {
        this.fileHandler.loadFromLocalStorage(selectedMap);
      }
    }

    // Add key to delete from local storage (Ctrl + D)
    if ((event.ctrlKey || event.metaKey) && event.key === "d") {
      event.preventDefault();
      const savedMindMaps = this.fileHandler.listSavedMindMaps();
      const mapToDelete = prompt(
        "Enter the name of the mind map to delete:",
        savedMindMaps.join(", ")
      );
      if (mapToDelete) {
        this.fileHandler.deleteFromLocalStorage(mapToDelete);
        alert(`Mind map '${mapToDelete}' has been deleted.`);
      }
    }
  }

  handleCanvasMouseWheel(event) {
    if (this.circleController.selectedCircle) {
      event.preventDefault();

      const { x, y } = this.getMouseCoordinates(event);
      const delta = Math.sign(event.deltaY); // Check scroll direction (+1 for scroll down, -1 for scroll up)

      const currentRadius = this.circleController.selectedCircle.radius;
      const newRadius = currentRadius + delta * DEFAULT_RADIUS_INCREMENT;

      this.circleController.selectedCircle.radius = Math.max(
        newRadius,
        MIN_CIRCLE_RADIUS
      );

      this.circleController.selectedCircle.actualiseText();
      this.circleController.moveCircle(
        this.circleController.selectedCircle,
        x,
        y
      );
    }
  }
}
