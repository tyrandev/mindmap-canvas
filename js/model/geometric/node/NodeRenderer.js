export default class NodeRenderer {
  constructor(context) {
    this.context = context;
  }

  drawShapeWithText(node) {
    throw new Error("Method 'drawShapeWithText()' must be implemented.");
  }

  drawCollapseIndicator(node) {
    if (!node.collapsed) return;
    this.context.save();
    this.context.fillStyle = "black";
    this.context.font = "14px Arial";
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
    const textY = this.calculateHeightOfCollapseIndicator(node);
    this.context.fillText("(collapsed)", node.x, textY);
    this.context.restore();
  }

  calculateHeightOfCollapseIndicator(node) {
    throw new Error(
      "Method 'calculateHeightOfCollapseIndicator()' must be implemented."
    );
  }

  drawNodeText(node) {
    this.setTextStyle(node);
    this.computeTextLines(node);
  }

  setTextStyle(node) {
    this.context.fillStyle = node.textColor;
    this.context.font = `${node.fontSize}px Arial`;
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
  }

  computeTextLines(node) {
    throw new Error("Method 'computeTextLines()' must be implemented.");
  }

  connectLineToChildNodes(node, child) {
    throw new Error("Method 'connectLineToChildNodes()' must be implemented.");
  }

  render(node) {
    if (node.hasCollapsedAncestor()) return;
    this.drawShapeWithText(node);
    if (!node.collapsed) {
      node.children.forEach((child) => {
        this.connectLineToChildNodes(node, child);
        child.render(this.context);
      });
    }
  }
}
