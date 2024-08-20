export default class NodeRenderer {
  constructor(nodeContainer) {
    this.nodeContainer = nodeContainer;
  }

  drawNodes(context) {
    this.nodeContainer.getNodes().forEach((node) => node.render(context));
  }
}
