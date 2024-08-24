import Canvas from "../view/Canvas.js";

export default class ContentRenderer {
  constructor(nodeContainer) {
    this.nodeContainer = nodeContainer;
    this.context = Canvas.getContext();
    this.renderedNodes = new Set();
  }

  drawNodes() {
    this.renderedNodes.clear();
    this.nodeContainer.getNodes().forEach((node) => this.renderNode(node));
  }

  renderNode(node) {
    if (this.isNodeRendered(node)) {
      return;
    }

    this.renderNodeContent(node);
    this.trackNodeAsRendered(node);
    this.renderNodeChildren(node);
  }

  isNodeRendered(node) {
    return this.renderedNodes.has(node.id);
  }

  renderNodeContent(node) {
    node.render(this.context);
  }

  trackNodeAsRendered(node) {
    this.renderedNodes.add(node.id);
  }

  renderNodeChildren(node) {
    if (node.children) {
      node.children.forEach((child) => this.renderNode(child));
    }
  }
}
