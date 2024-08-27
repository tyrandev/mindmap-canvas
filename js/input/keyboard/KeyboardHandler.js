import Canvas from "../../view/Canvas.js";
import StorageUtil from "../../util/storage/StorageUtil.js";
import MouseModeManager from "../mouse/MouseModeManager.js";
import * as MouseConstants from "../../constants/MouseConstants.js";
import * as GlobalConstants from "../../constants/GlobalConstants.js";

export default class KeyboardHandler {
  constructor(systemCore) {
    this.systemCore = systemCore;
    this.canvas = Canvas.getCanvas();
    this.nodeController = systemCore.nodeController;
    this.selectionController = systemCore.selectionController;
    this.mindmapHandler = systemCore.mindmapHandler;
    this.fileInput = systemCore.fileInput;
    this.initKeyListeners();
  }

  initKeyListeners() {
    this.canvas.addEventListener("keydown", this.handleKeyDown.bind(this));
    this.canvas.addEventListener("keyup", this.handleShiftKeyUp.bind(this));
  }

  handleKeyDown(event) {
    const key = event.key.toLowerCase();
    // console.log("Key pressed:", event.key);

    const handlers = {
      f2: this.handleRenameNode.bind(this),
      f3: this.handleToggleCollapse.bind(this),
      backspace: this.handleDeleteNode.bind(this),
      delete: this.handleDeleteNode.bind(this),
      tab: this.handleRandomizeColor.bind(this),
      escape: this.handleUnselectNode.bind(this),
      shift: this.handleShiftKeyDown.bind(this),
      z: this.handleUndo.bind(this),
      y: this.handleRedo.bind(this),
      e: this.handleExportToJson.bind(this),
      b: this.handleToggleLocalStorage.bind(this),
      s: this.handleSaveToLocalStorage.bind(this),
      m: this.handleListSavedMindMaps.bind(this),
      p: this.handleLoadMindMap.bind(this),
      d: this.handleDeleteMindMap.bind(this),
      o: this.handleCenterMindmap.bind(this),
      r: this.handleResetMindmap.bind(this),
      "+": this.handleIncreaseNodeSize.bind(this),
      "-": this.handleDecreaseNodeSize.bind(this),
    };

    if (handlers[key]) {
      event.preventDefault();
      handlers[key](event);
    }

    this.handleArrowKeys(event);
  }

  handleArrowKeys(event) {
    const canvasContainer = document.getElementById(
      GlobalConstants.CANVAS_CONTAINER_ID
    );
    const scrollStep = 8;

    switch (event.key) {
      case "ArrowUp":
        canvasContainer.scrollTop -= scrollStep;
        break;
      case "ArrowDown":
        canvasContainer.scrollTop += scrollStep;
        break;
      case "ArrowLeft":
        canvasContainer.scrollLeft -= scrollStep;
        break;
      case "ArrowRight":
        canvasContainer.scrollLeft += scrollStep;
        break;
    }
  }

  handleResetMindmap(event) {
    if (event.ctrlKey) {
      this.nodeController.resetMindmap();
    }
  }

  handleCenterMindmap(event) {
    if (event.ctrlKey) {
      this.nodeController.moveRootNodeToCenter();
    }
  }

  handleShiftKeyUp(event) {
    if (event.key === "Shift") {
      MouseModeManager.setMode(MouseConstants.MOUSE_MODES.NORMAL);
    }
  }

  handleShiftKeyDown(event) {
    if (event.type === "keydown") {
      MouseModeManager.setMode(MouseConstants.MOUSE_MODES.GRABBING_MINDMAP);
      console.log("Dragging is on");
    } else if (event.type === "keyup") {
      MouseModeManager.setMode(MouseConstants.MOUSE_MODES.NORMAL);
    }
  }

  handleUndo(event) {
    if (event.ctrlKey) {
      this.nodeController.undo();
    }
  }

  handleRedo(event) {
    if (event.ctrlKey) {
      this.nodeController.redo();
    }
  }

  handleToggleCollapse(event) {
    this.selectionController.toggleSelectedNodeCollapse();
  }

  handleRenameNode(event) {
    this.selectionController.renameSelectedNodePrompt();
  }

  handleExportToJson(event) {
    if (event.ctrlKey || event.metaKey) {
      this.mindmapHandler.exportToJson();
    }
  }

  handleToggleLocalStorage(event) {
    if (event.ctrlKey || event.metaKey) {
      StorageUtil.toggleStorageContainerDisplay();
    }
  }

  handleDeleteNode(event) {
    if (this.selectionController.getSelectedNode()) {
      this.nodeController.removeNode(
        this.selectionController.getSelectedNode()
      );
    }
  }

  handleRandomizeColor(event) {
    this.selectionController.randomizeSelectedNodeColor();
  }

  handleUnselectNode(event) {
    this.selectionController.unselectNode();
  }

  handleSaveToLocalStorage(event) {
    if (event.ctrlKey || event.metaKey) {
      this.mindmapHandler.saveToLocalStorage();
    }
  }

  handleListSavedMindMaps(event) {
    if (event.ctrlKey || event.metaKey) {
      const savedMindMaps = this.mindmapHandler.listSavedMindMaps();
      this.mindmapHandler.createLocalStorageList();
      alert("Saved mind maps:\n" + savedMindMaps.join("\n"));
    }
  }

  handleLoadMindMap(event) {
    if (event.ctrlKey || event.metaKey) {
      const savedMindMaps = this.mindmapHandler.listSavedMindMaps();
      const selectedMap = prompt(
        "Enter the name of the mind map to load:",
        savedMindMaps.join(", ")
      );
      if (selectedMap) {
        this.mindmapHandler.loadFromLocalStorage(selectedMap);
      }
    }
  }

  handleDeleteMindMap(event) {
    if (event.ctrlKey || event.metaKey) {
      const savedMindMaps = this.mindmapHandler.listSavedMindMaps();
      const mapToDelete = prompt(
        "Enter the name of the mind map to delete:",
        savedMindMaps.join(", ")
      );
      if (mapToDelete) {
        this.mindmapHandler.deleteFromLocalStorage(mapToDelete);
        alert(`Mind map '${mapToDelete}' has been deleted.`);
      }
    }
  }

  handleIncreaseNodeSize() {
    this.selectionController.updateSelectedNodeDimensions(5);
  }

  handleDecreaseNodeSize() {
    this.selectionController.updateSelectedNodeDimensions(-5);
  }
}
