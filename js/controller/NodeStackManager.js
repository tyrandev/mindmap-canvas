//TODO: solve problem: rootNode.clone() creates invisible copy of root node and its children

export default class NodeStackManager {
  constructor() {
    this.undoStack = [];
    this.redoStack = [];
    this.currentState = null;
  }

  setCurrentState(rootNode) {
    this.currentState = rootNode.clone();
  }

  saveStateForUndo() {
    if (this.currentState) {
      this.undoStack.push(this.currentState);
      this.redoStack = [];
      console.log("State was saved for undo:", this.currentState);
    }
  }

  undo() {
    if (this.undoStack.length > 0) {
      this.redoStack.push(this.currentState);
      this.currentState = this.undoStack.pop();
      return this.currentState;
    }
    return null;
  }

  redo() {
    if (this.redoStack.length > 0) {
      this.undoStack.push(this.currentState);
      this.currentState = this.redoStack.pop();
      return this.currentState;
    }
    return null;
  }

  clearAllStacks() {
    this.undoStack = [];
    this.redoStack = [];
    this.currentState = null;
    console.log("All stacks cleared.");
  }
}
