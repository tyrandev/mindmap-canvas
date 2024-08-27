import Node from "./Node.js";

export default class NodeContainer {
  constructor() {
    this.nodes = [];
  }

  putNodeIntoContainer(node) {
    if (!(node instanceof Node)) {
      console.error("Following object is not a Node: ", node);
      return;
    }
    this.nodes.push(node);
  }

  putNodeAndChildrenIntoContainer(node) {
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

  clearNodes() {
    this.nodes = [];
  }

  getNodes() {
    return this.nodes;
  }

  equals(otherContainer) {
    if (!(otherContainer instanceof NodeContainer)) return false;
    if (this.nodes.length !== otherContainer.getNodes().length) return false;

    const otherNodeMap = new Map(
      otherContainer.getNodes().map((node) => [node.id, node])
    );

    for (const node of this.nodes) {
      const otherNode = otherNodeMap.get(node.id);
      if (!otherNode || !node.equals(otherNode)) {
        return false;
      }
    }

    return true;
  }
}
