import Canvas from "../view/Canvas.js";

export default class NodeRenderer {
  constructor(nodeContainer) {
    this.nodeContainer = nodeContainer;
    this.context = Canvas.getContext();
  }

  drawNodes() {
    this.nodeContainer.getNodes().forEach((node) => node.render(this.context));
  }
}
