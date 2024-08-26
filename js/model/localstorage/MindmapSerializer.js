import NodeSerializer from "../../util/serializer/NodeSerializer.js";

export default class MindmapSerializer {
  constructor(nodeController) {
    this.nodeController = nodeController;
  }

  serialize() {
    const rootCircle = this.nodeController.getRootNode();
    return NodeSerializer.serialize(rootCircle);
  }

  deserialize(json) {
    return NodeSerializer.deserialize(json);
  }
}
