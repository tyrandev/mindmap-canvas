export default class LocalStorageHandler {
  constructor(storageKey) {
    this.storageKey = storageKey;
  }

  saveItem(name, data) {
    const storageData = this._getAllItems();
    storageData[name] = data;
    localStorage.setItem(this.storageKey, JSON.stringify(storageData));
  }

  getItem(name) {
    const storageData = this._getAllItems();
    return storageData[name] || null;
  }

  deleteItem(name) {
    const storageData = this._getAllItems();
    if (name in storageData) {
      delete storageData[name];
      localStorage.setItem(this.storageKey, JSON.stringify(storageData));
    }
  }

  renameItem(oldName, newName) {
    const storageData = this._getAllItems();
    if (oldName in storageData && !(newName in storageData)) {
      storageData[newName] = storageData[oldName];
      delete storageData[oldName];
      localStorage.setItem(this.storageKey, JSON.stringify(storageData));
    }
  }

  listItems() {
    return Object.keys(this._getAllItems());
  }

  _getAllItems() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : {};
  }
}
