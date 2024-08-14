import CircleTextHelper from "../circle/helper/CircleTextHelper.js";
import * as CircleConstants from "../../../constants/CircleConstants.js";

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

    if (Node.idCounter !== 0 && !parent) {
      throw new Error("Nodes must have a parent or be created with ID 0.");
    }
    if (parent && x === parent.x && y === parent.y) {
      throw new Error(
        "Cannot create node at the same position as parent node."
      );
    }
    console.log("Node created: ", this);
    //debugger;
  }

  clone() {
    throw new Error("Method 'clone()' must be implemented.");
  }

  getSelf() {
    console.log(this);
    return this;
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

  drawCollapseIndicator(context) {
    context.save();
    context.fillStyle = "black";
    context.font = "14px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    // TODO: next line functionnality is not working
    const textY = this.y - this.getRadius() - 10;
    context.fillText("(collapsed)", this.x, textY);
    context.restore();
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
    this.text = CircleTextHelper.limitTextCharacterNumber(newText);
    this.fontSize = CircleTextHelper.calculateFontSize(this.text, this.radius);
    if (isNaN(this.fontSize) || this.fontSize <= 0) {
      console.error(`Invalid fontSize calculated: ${this.fontSize}`);
      this.fontSize = CircleConstants.BASE_FONT_SIZE;
    }
  }

  drawNodeText(context) {
    const lines = CircleTextHelper.splitTextIntoLines(
      this.text,
      this.radius,
      this.fontSize
    );
    context.fillStyle = this.textColor;
    context.font = `${this.fontSize}px Arial`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    lines.forEach((line, index) => {
      const lineHeight = this.fontSize + 4;
      const y = this.y + (index - lines.length / 2 + 0.5) * lineHeight;
      context.fillText(line, this.x, y);
    });
  }

  addChildNode(child) {
    this.children.push(child);
    child.parent = this;
  }

  removeChildNode(child) {
    this.children = this.children.filter((node) => node !== child);
    child.parent = null;
  }

  drawNodes(context) {
    if (this.hasCollapsedAncestor()) {
      return;
    }
    this.drawShapeWithText(context);
    if (!this.collapsed) {
      this.children.forEach((child) => {
        this.connectLineToChildNodes(context, child);
        child.drawNodes(context);
      });
    }
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
}
