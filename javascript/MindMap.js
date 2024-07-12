import Circle from "./circle/Circle.js";
import CircleController from "./circle/CircleController.js";
import LocalStorageFileHandler from "./LocalStorageFileHandler.js";
import * as CircleConstants from "./circle/CircleConstants.js";
import KeyboardHandler from "./KeyboardHandler.js";
import MouseHandler from "./MouseHandler.js";

export default class MindMap {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext("2d");
    this.circleController = new CircleController(this.canvas, this.context);
    this.fileHandler = new LocalStorageFileHandler(this.circleController);
    this.keyboardHandler = new KeyboardHandler(this);
    this.mouseHandler = new MouseHandler(this);

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
    const sampleCircle = new Circle(
      1335,
      860,
      CircleConstants.BASE_CIRCLE_RADIUS,
      initialText
    );
    this.circleController.addCircle(sampleCircle);
  }
}
