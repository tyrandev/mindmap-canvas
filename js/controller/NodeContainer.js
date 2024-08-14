export default class NodeContainer {
  constructor() {
    this.nodes = [];
  }

  addNode(node) {
    this.nodes.push(node);
  }

  addNodeAndChildren(node) {
    const addNodeRecursively = (node) => {
      this.nodes.push(node);
      node.children.forEach(addNodeRecursively);
    };
    addNodeRecursively(node);
  }

  removeNodeAndChildren(nodeToRemove) {
    this.nodes = this.nodes.filter(
      (nodeToCheck) => !this.isNodeOrDescendant(nodeToCheck, nodeToRemove)
    );
    if (nodeToRemove.parent) {
      nodeToRemove.parent.removeChildNode(nodeToRemove);
    }
  }

  isNodeOrDescendant(candidate, node) {
    if (candidate === node) return true;
    for (let child of node.children) {
      if (this.isNodeOrDescendant(candidate, child)) return true;
    }
    return false;
  }

  getNodeAtPosition(x, y) {
    return this.nodes.find((node) => node.isPointInsideOfNode(x, y));
  }

  getRootNode() {
    return this.nodes.find((node) => node.id === 0);
  }

  clearNodes() {
    this.nodes = [];
  }

  getNodes() {
    return this.nodes;
  }
}
