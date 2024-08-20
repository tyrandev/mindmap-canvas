import Canvas from "../view/Canvas.js";

export default class NodeRenderer {
  constructor(nodeContainer) {
    this.nodeContainer = nodeContainer;
    this.context = Canvas.getContext();
    this.renderedNodes = new Set();
  }

  drawNodes() {
    this.renderedNodes.clear(); // Clear the set of previously rendered nodes
    this.nodeContainer.getNodes().forEach((node) => this.renderNode(node));
  }

  renderNode(node) {
    if (this.renderedNodes.has(node.id)) {
      return;
    }

    // Render the node and track it
    node.render(this.context);
    this.renderedNodes.add(node.id);

    // Recursively render children if the node has any
    if (node.children) {
      node.children.forEach((child) => this.renderNode(child));
    }
  }
}
