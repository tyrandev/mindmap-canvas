export default class DragAndDropHandler {
  constructor(onFileDrop) {
    this.onFileDrop = onFileDrop;
    this._initializeDragAndDrop();
  }

  _initializeDragAndDrop() {
    document.body.addEventListener("dragover", this._handleDragOver.bind(this));
    document.body.addEventListener("drop", this._handleDrop.bind(this));
  }

  _handleDragOver(event) {
    event.preventDefault(); // Necessary to allow the drop
  }

  _handleDrop(event) {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && this.onFileDrop) {
      this.onFileDrop(file);
    }
  }
}
