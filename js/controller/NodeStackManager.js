export default class NodeStackManager {
  constructor() {
    this.undoStack = [];
    this.redoStack = [];
    this.rootCircleState = [];
  }

  saveStateForUndo(rootCircle) {
    if (rootCircle) {
      this.undoStack.push(rootCircle.clone());
      this.redoStack = [];
    }
  }

  undo(currentRootCircle, restoreStateCallback) {
    if (this.undoStack.length > 0) {
      const state = this.undoStack.pop();
      this.redoStack.push(currentRootCircle.clone());
      restoreStateCallback(state);
    }
  }

  redo(currentRootCircle, restoreStateCallback) {
    if (this.redoStack.length > 0) {
      const state = this.redoStack.pop();
      this.undoStack.push(currentRootCircle.clone());
      restoreStateCallback(state);
    }
  }

  clearAllStacks() {
    this.undoStack = [];
    this.redoStack = [];
    this.rootCircleState = [];
    console.log("All stacks cleared.");
  }
}
