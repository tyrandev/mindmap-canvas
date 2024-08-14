import fileInputManager from "../../util/file/FileInputManager.js";

export default class LocalStorageUIHandler {
  constructor(localStorageFileHandler) {
    this.localStorageFileHandler = localStorageFileHandler;
    this.setupFileInput();
    this.updateLocalStorageList();
  }

  setupFileInput() {
    this.fileInput = fileInputManager.getFileInput();
    this.fileInput.addEventListener(
      "change",
      this.handleFileInputChange.bind(this)
    );
  }

  handleFileInputChange(event) {
    this.localStorageFileHandler.loadFromJson(event);
  }

  updateLocalStorageList() {
    const mindmapListDiv = this.getMindmapListDiv();
    if (!mindmapListDiv) return;

    this.clearMindmapListDiv(mindmapListDiv);
    const mindmaps = this.localStorageFileHandler.listSavedMindMaps();
    mindmaps.forEach((name) => {
      const itemDiv = this.createMindmapListItem(name);
      mindmapListDiv.appendChild(itemDiv);
    });
  }

  getMindmapListDiv() {
    const mindmapListDiv = document.getElementById("local-storage-list");
    if (!mindmapListDiv) {
      console.error('No div with id "local-storage-list" found.');
    }
    return mindmapListDiv;
  }

  clearMindmapListDiv(mindmapListDiv) {
    mindmapListDiv.innerHTML = "";
  }

  createMindmapListItem(name) {
    const divItem = this.createElementWithClass("div", "local-storage-item");
    const nameSpan = this.createElementWithClass(
      "span",
      "local-storage-item-name"
    );
    nameSpan.textContent = name;
    divItem.appendChild(nameSpan);
    this.addLoadEventListener(divItem, name);

    const renameButton = this.createButton(
      "Rename",
      "rename-button-local-storage"
    );
    this.addRenameEventListener(renameButton, name);
    divItem.appendChild(renameButton);

    const deleteButton = this.createButton("X", "delete-button-local-storage");
    this.addDeleteEventListener(deleteButton, name);
    divItem.appendChild(deleteButton);

    return divItem;
  }

  createElementWithClass(tag, className) {
    const element = document.createElement(tag);
    element.classList.add(className);
    return element;
  }

  createButton(text, className) {
    const button = this.createElementWithClass("button", className);
    button.textContent = text;
    button.classList.add("button-local-storage");
    return button;
  }

  addLoadEventListener(element, name) {
    element.addEventListener("click", () => {
      this.localStorageFileHandler.loadFromLocalStorage(name);
    });
  }

  addRenameEventListener(button, name) {
    button.addEventListener("click", (event) => {
      event.stopPropagation(); // Prevent triggering the load action
      this.handleRename(name);
    });
  }

  handleRename(name) {
    const newName = prompt(`Enter a new name for "${name}":`);
    if (newName) {
      this.localStorageFileHandler.renameInLocalStorage(name, newName);
      this.updateLocalStorageList();
    }
  }

  addDeleteEventListener(button, name) {
    button.addEventListener("click", (event) => {
      event.stopPropagation(); // Prevent triggering the load action
      this.handleDelete(name);
    });
  }

  handleDelete(name) {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      this.localStorageFileHandler.deleteFromLocalStorage(name);
      this.updateLocalStorageList();
    }
  }
}
