export default class Node {
  static idCounter = 0;

  constructor(
    x = 0,
    y = 0,
    text = "",
    fillColor = "white",
    borderColor = "black",
    textColor = "black",
    borderWidth = 1
  ) {
    if (new.target === Node) {
      throw new Error("Cannot instantiate an abstract class.");
    }
    this.id = Node.generateId();
    this.x = x;
    this.y = y;
    this.text = text;
    this.fillColor = fillColor;
    this.borderColor = borderColor;
    this.textColor = textColor;
    this.borderWidth = borderWidth;
    this.collapsed = false;
    this.children = [];
    this.parent = null;
  }

  clone() {
    throw new Error("Method 'clone()' must be implemented.");
  }

  setId(newId) {
    this.id = newId;
  }

  static generateId() {
    const nodeID = Node.idCounter++;
    return nodeID;
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

  setBorderColor(newColor) {
    this.borderColor = newColor;
  }

  setFillColor(newColor) {
    this.fillColor = newColor;
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

  setTextStyle(context) {
    context.fillStyle = this.textColor;
    context.font = `${this.fontSize}px Arial`;
    context.textAlign = "center";
    context.textBaseline = "middle";
  }

  drawNodeText(context) {
    this.setTextStyle(context);
    this.computeTextLines(context);
  }

  computeTextLines(context) {
    throw new Error("Method 'computeTextLines()' must be implemented.");
  }

  addChildNode(child) {
    this.children.push(child);
    child.parent = this;
  }

  removeChildNode(child) {
    this.children = this.children.filter((node) => node !== child);
    child.parent = null;
  }

  drawShapeWithText(context) {
    throw new Error("Method 'drawShapeWithText()' must be implemented.");
  }

  connectLineToChildNodes(context, child) {
    throw new Error("Method 'connectLineToChildNodes()' must be implemented.");
  }

  getRadius() {
    throw new Error("Method 'getRadius()' must be implemented.");
  }

  isPointInsideOfNode(x, y) {
    throw new Error("Method 'isPointInsideOfNode()' must be implemented.");
  }

  toJSON() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      text: this.text,
      fillColor: this.fillColor,
      borderColor: this.borderColor,
      textColor: this.textColor,
      borderWidth: this.borderWidth,
      collapsed: this.collapsed,
      children: this.children.map((child) => child.toJSON()), // Recursively call toJSON on children
    };
  }
}
