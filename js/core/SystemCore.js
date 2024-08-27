import NodeController from "../controller/NodeController.js";
import SelectionController from "../controller/SelectionController.js";
import KeyboardHandler from "../input/keyboard/KeyboardHandler.js";
import MouseHandler from "../input/mouse/MouseHandler.js";
import TopMenuHandler from "../gui/topmenu/TopMenuHandler.js";
import ScrollUtil from "../util/canvas/ScrollUtil.js";
import DraggingUtil from "../util/canvas/DraggingUtil.js";
import Canvas from "../view/Canvas.js";
import NodeContainer from "../model/geometric/node/NodeContainer.js";
import GraphicsEngine from "../engine/GraphicsEngine.js";
import OSUtil from "../util/os/OSUtil.js";
import BrowserUtil from "../util/browser/BrowserUtil.js";
import DragAndDropHandler from "../util/file/DragAndDropHandler.js";
import MindmapLocalStorage from "../data/persistence/MindmapLocalStorage.js";

export default class SystemCore {
  startApplication() {
    console.log(OSUtil.getOS());
    console.log(BrowserUtil.getBrowser());
    this.initializeCanvas();
    this.initializeControllers();
    this.initializeEngine();
    this.initializeHandlers();
    this.initializeUtilities();
  }

  initializeCanvas() {
    Canvas.setCanvasSize(4000, 2160);
  }

  initializeControllers() {
    this.nodeContainer = new NodeContainer();
    this.nodeController = new NodeController(this.nodeContainer);
    this.selectionController = new SelectionController();
    this.mindmapLocalStorage = new MindmapLocalStorage(this.nodeController);
  }

  initializeHandlers() {
    this.dragAndDropHandler = new DragAndDropHandler();
    this.keyboardHandler = new KeyboardHandler(this);
    this.topMenuHandler = new TopMenuHandler(this);
    this.mouseHandler = new MouseHandler(this);
  }

  initializeUtilities() {
    ScrollUtil.scrollToCenter();
    DraggingUtil.init();
  }

  initializeEngine() {
    this.graphicsEngine = new GraphicsEngine(this.nodeContainer);
  }
}
