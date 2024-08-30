import Rectangle from "../rectangle/Rectangle.js";

export default class BorderlessRectangle extends Rectangle {
  constructor(x = 0, y = 0) {
    super(x, y);
    this.makeInvisible();
  }

  makeInvisible() {
    this.fillColor = "white";
    this.borderColor = "rgba(0, 0, 0, 0)"; // Transparent border
    this.borderWidth = 0;
  }

  setFillColor(color) {
    console.log("Fill color cannot be set.");
  }

  clone() {
    const clone = new BorderlessRectangle(this.x, this.y);
    clone.width = this.width;
    clone.height = this.height;
    clone.text = this.text;
    clone.cornerRadii = this.cornerRadii;
    clone.id = this.id;
    clone.collapsed = this.collapsed;
    this.children.forEach((child) => {
      const childClone = child.clone();
      clone.addChildNode(childClone);
    });
    clone.makeInvisible(); // Ensure the clone also has the invisible properties
    return clone;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      type: "BorderlessRectangle",
    };
  }
}
