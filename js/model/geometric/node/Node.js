import ColorHandler from "../../../util/color/ColorHandler.js";

export default class Node {
  constructor(x = 0, y = 0) {
    if (new.target === Node) {
      throw new Error("Cannot instantiate an abstract class.");
    }
    this.id = 0;
    this.x = x;
    this.y = y;
    this.text = "New Node";
    this.fillColor = "#FFFFE0";
    this.borderColor = "black";
    this.textColor = "black";
    this.lineColor = "red";
    this.borderWidth = 1;
    this.collapsed = false;
    this.children = [];
    this.parent = null;
    this.setColorsBasedOnFillColor(this.fillColor);
  }

  clone() {
    throw new Error("Method 'clone()' must be implemented.");
  }

  setId(newId) {
    this.id = newId;
  }

  setCollapsed(collapsed) {
    this.collapsed = collapsed;
  }

  hasChildren() {
    return this.children.length > 0;
  }

  getText() {
    return this.text;
  }

  setLineColor(newColor) {
    this.lineColor = newColor;
  }

  getLineColor() {
    return this.lineColor;
  }

  setBorderColor(newColor) {
    this.borderColor = newColor;
  }

  setFillColor(newColor) {
    this.fillColor = newColor;
    this.setColorsBasedOnFillColor(newColor);
  }

  setColorsBasedOnFillColor(newColor) {
    const darkenedColor = ColorHandler.darkenColor(newColor, 35);
    this.setBorderColor(darkenedColor);
    this.setLineColor(darkenedColor);
  }

  getFillColor() {
    return this.fillColor;
  }

  toggleCollapse() {
    if (!this.hasChildren()) return;
    this.collapsed = !this.collapsed;
  }

  calculateHeightOfCollapseIndicator() {
    throw new Error(
      "Method 'calculateHeightOfCollapseIndicator()' must be implemented."
    );
  }

  hasCollapsedAncestor() {
    let currentNode = this;
    while (currentNode.parent) {
      if (currentNode.parent.collapsed) {
        return true;
      }
      currentNode = currentNode.parent;
    }
    return false;
  }

  actualiseText() {
    this.setText(this.text);
  }

  setText(newText) {
    throw new Error("Method 'setText()' must be implemented.");
  }

  addChildNode(child) {
    this.children.push(child);
    child.parent = this;
  }

  removeChildNode(child) {
    this.children = this.children.filter((node) => node !== child);
    child.parent = null;
  }

  isPointInsideOfNode(x, y) {
    throw new Error("Method 'isPointInsideOfNode()' must be implemented.");
  }

  getClassName() {
    return this.constructor.name;
  }

  toJSON() {
    return {
      type: this.getClassName(),
      id: this.id,
      x: this.x,
      y: this.y,
      text: this.text,
      fillColor: this.fillColor,
      borderColor: this.borderColor,
      textColor: this.textColor,
      borderWidth: this.borderWidth,
      collapsed: this.collapsed,
      children: this.children.map((child) => child.toJSON()),
    };
  }

  equals(other) {
    if (!(other instanceof Node)) {
      return false;
    }

    return (
      this.x === other.x &&
      this.y === other.y &&
      this.text === other.text &&
      this.fillColor === other.fillColor &&
      this.collapsed === other.collapsed &&
      (this.parent === other.parent ||
        (this.parent && other.parent && this.parent.id === other.parent.id))
    );
  }
}
