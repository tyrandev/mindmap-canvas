import Node from "../model/geometric/node/Node.js";

export default class NodeContainer {
  constructor() {
    this.nodes = [];
  }

  addNode(node) {
    if (!(node instanceof Node)) {
      console.error("Invalid node type. Must be an instance of Node.");
      return;
    }
    this.nodes.push(node);
  }

  removeNode(node) {
    this.nodes = this.nodes.filter((n) => n !== node);
  }

  getNodes() {
    return this.nodes;
  }

  clearNodes() {
    this.nodes = [];
  }

  findNode(predicate) {
    return this.nodes.find(predicate);
  }

  forEachNode(callback) {
    this.nodes.forEach(callback);
  }
}
