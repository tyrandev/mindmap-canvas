export default class NodeStackManager {
  constructor(restoreStateCallback) {
    this.undoStack = [];
    this.redoStack = [];
    this.restoreStateCallback = restoreStateCallback;
  }

  saveStateForUndo(rootNode) {
    if (rootNode) {
      this.undoStack.push(rootNode.clone());
      this.redoStack = [];
      console.log("state was saved for undo: ", rootNode);
    }
  }

  undo(currentRootNode) {
    if (this.undoStack.length > 0) {
      const state = this.undoStack.pop();
      this.redoStack.push(currentRootNode.clone());
      if (this.restoreStateCallback) {
        this.restoreStateCallback(state);
      }
    }
  }

  redo(currentRootNode) {
    if (this.redoStack.length > 0) {
      const state = this.redoStack.pop();
      this.undoStack.push(currentRootNode.clone());
      if (this.restoreStateCallback) {
        this.restoreStateCallback(state);
      }
    }
  }

  clearAllStacks() {
    this.undoStack = [];
    this.redoStack = [];
    console.log("All stacks cleared.");
  }
}
