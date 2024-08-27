import Canvas from "../../view/Canvas.js";
import CircleRenderer from "./shapes/CircleRenderer.js";
import RectangleRenderer from "./shapes/RectangleRenderer.js";
import Rectangle from "../../model/geometric/rectangle/Rectangle.js";
import Circle from "../../model/geometric/circle/Circle.js";

// TODO: render frame only when lastNodeContainer from last frame is not equal to nodeContainer from current frame. there is a equals method in NodeContainer
export default class ContentRenderer {
  constructor(nodeContainer) {
    this.nodeContainer = nodeContainer;
    this.context = Canvas.getContext();
    this.renderedNodes = new Set();
    this.circleRenderer = new CircleRenderer(this.context);
    this.rectangleRenderer = new RectangleRenderer(this.context);
  }

  drawNodes() {
    this.renderedNodes.clear();
    this.nodeContainer.getNodes().forEach((node) => this.renderNode(node));
  }

  renderNode(node) {
    this.renderNodeContent(node);
    this.trackNodeAsRendered(node);
    this.renderNodeChildren(node);
  }

  renderNodeContent(node) {
    if (node instanceof Rectangle) {
      this.rectangleRenderer.render(node);
    } else if (node instanceof Circle) {
      this.circleRenderer.render(node);
    } else {
      throw new Error("Trying to render unsupported type of node");
    }
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
