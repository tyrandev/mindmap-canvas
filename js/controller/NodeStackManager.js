import StackEventEmitter from "../event/StackEventEmitter.js";

export default class NodeStackManager {
  constructor() {
    this.undoStack = [];
    this.redoStack = [];
    this.setupEventListeners();
  }

  saveStateForUndo(rootCircle) {
    if (rootCircle) {
      this.undoStack.push(rootCircle.clone());
      this.redoStack = [];
    }
  }

  undo(currentRootNode, restoreStateCallback) {
    if (this.undoStack.length > 0) {
      const state = this.undoStack.pop();
      this.redoStack.push(currentRootNode.clone());
      restoreStateCallback(state);
    }
  }

  redo(currentRootNode, restoreStateCallback) {
    if (this.redoStack.length > 0) {
      const state = this.redoStack.pop();
      this.undoStack.push(currentRootNode.clone());
      restoreStateCallback(state);
    }
  }

  clearAllStacks() {
    this.undoStack = [];
    this.redoStack = [];
    console.log("All stacks cleared.");
  }

  setupEventListeners() {
    StackEventEmitter.on("saveStateForUndo", (rootNode) => {
      console.log("Save state event received");
    });
  }
}
