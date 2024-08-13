export default class StorageUtil {
  static toggleStorageContainerDisplay() {
    const storageContainer = document.getElementById("storage-container");
    const displayStyle = window.getComputedStyle(storageContainer).display;
    if (displayStyle === "none") {
      storageContainer.style.display = "block";
    } else {
      storageContainer.style.display = "none";
    }
  }
}
