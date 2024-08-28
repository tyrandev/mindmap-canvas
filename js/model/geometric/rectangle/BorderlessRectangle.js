import Rectangle from "../rectangle/Rectangle.js";

export default class BorderlessRectangle extends Rectangle {
  constructor(x = 0, y = 0) {
    super(x, y);
    this.makeInvisible();
  }

  makeInvisible() {
    // this.fillColor = "rgba(0, 0, 0, 0)";
    this.fillColor = "white";
    this.borderColor = "rgba(0, 0, 0, 0)";
    this.borderWidth = 0;
  }

  setFillColor(color) {
    console.log("fill color cannot be set;");
  }

  calculateFontSize() {
    this.fontSize = this.height / 2.5;
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
    clone.makeInvisible();
    return clone;
  }
}
