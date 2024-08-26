export default class MindmapMath {
  static calculatePositionOfNewNode(
    parentNode,
    distanceFromParentNode,
    mouseX,
    mouseY
  ) {
    const deltaX = mouseX - parentNode.x;
    const deltaY = mouseY - parentNode.y;
    const angle = Math.atan2(deltaY, deltaX);
    const x = parentNode.x + distanceFromParentNode * Math.cos(angle);
    const y = parentNode.y + distanceFromParentNode * Math.sin(angle);
    return { x, y };
  }
}
