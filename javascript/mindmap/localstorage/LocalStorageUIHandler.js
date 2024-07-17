export default class LocalStorageUIHandler {
  constructor(localStorageFileHandler) {
    this.localStorageFileHandler = localStorageFileHandler;
    this.createLocalStorageList();
  }

  createLocalStorageList() {
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
    const div = document.createElement("div");
    div.classList.add("local-storage-item");
    div.textContent = name;
    this.addLoadEventListener(div, name);
    const renameButton = this.createRenameButton(name);
    const deleteButton = this.createDeleteButton(name);
    div.appendChild(renameButton);
    div.appendChild(deleteButton);
    return div;
  }

  addLoadEventListener(element, name) {
    element.addEventListener("click", () => {
      this.localStorageFileHandler.loadFromLocalStorage(name);
    });
  }

  createRenameButton(name) {
    const renameButton = document.createElement("button");
    renameButton.classList.add("rename-button");
    renameButton.textContent = "Rename";
    this.addRenameEventListener(renameButton, name);
    return renameButton;
  }

  addRenameEventListener(button, name) {
    button.addEventListener("click", (event) => {
      event.stopPropagation(); // Prevent triggering the load action
      const newName = prompt(`Enter a new name for "${name}":`);
      if (newName) {
        this.localStorageFileHandler.renameInLocalStorage(name, newName);
        this.createLocalStorageList(); // Update the list
      }
    });
  }

  createDeleteButton(name) {
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.textContent = "Delete";
    this.addDeleteEventListener(deleteButton, name);
    return deleteButton;
  }

  addDeleteEventListener(button, name) {
    button.addEventListener("click", (event) => {
      event.stopPropagation(); // Prevent triggering the load action
      if (confirm(`Are you sure you want to delete "${name}"?`)) {
        this.localStorageFileHandler.deleteFromLocalStorage(name);
        this.createLocalStorageList(); // Update the list
      }
    });
  }
}
