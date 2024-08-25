import Node from "../node/Node.js";
import * as RectangleConstants from "../../../constants/RectangleConstants.js";

export default class Rectangle extends Node {
  constructor(x = 0, y = 0) {
    super(x, y);
    this.additionalWidth = 0;
    this.width = RectangleConstants.BASE_RECTANGLE_WIDTH;
    this.height = RectangleConstants.BASE_RECTANGLE_HEIGHT;
    this.originalWidth = this.width;
    this.text = RectangleConstants.NODE_DEFAULT_NAME;
    this.fillColor = RectangleConstants.BASE_RECTANGLE_COLOR;
    this.borderColor = "black";
    this.textColor = "black";
    this.borderWidth = RectangleConstants.BASE_RECTANGLE_BORDER_WIDTH;
    this.cornerRadii = [2, 2, 2, 2]; // [top-left, top-right, bottom-right, bottom-left]
    this.setText(this.text);
    this.calculateFontSize();
  }

  clone() {
    const clone = new Rectangle(this.x, this.y);
    clone.width = this.width;
    clone.height = this.height;
    clone.text = this.text;
    clone.fillColor = this.fillColor;
    clone.borderColor = this.borderColor;
    clone.textColor = this.textColor;
    clone.borderWidth = this.borderWidth;
    clone.cornerRadii = this.cornerRadii;
    clone.id = this.id;
    clone.collapsed = this.collapsed;
    this.children.forEach((child) => {
      // const childClone = child.clone();
      // clone.addChildNode(childClone);
    });
    return clone;
  }

  get width() {
    return this.originalWidth;
  }

  set width(value) {
    this.originalWidth = value;
    this.addWidthBasedOnTextLength();
    this.calculateFontSize();
  }

  get actualWidth() {
    return this.originalWidth + this.additionalWidth;
  }

  setDimensions(newWidth, newHeight) {
    console.log(`Old Width: ${this.originalWidth}, New Width: ${newWidth}`);
    console.log(`Old Height: ${this.height}, New Height: ${newHeight}`);
    this.originalWidth = newWidth;
    this.height = newHeight;
    this.addWidthBasedOnTextLength();
    this.calculateFontSize();
  }

  addWidthBasedOnTextLength() {
    const countLettersAndNumbers = this.text.replace(
      /[^a-zA-Z0-9]/g,
      ""
    ).length;
    if (countLettersAndNumbers > 12) {
      this.additionalWidth = Math.max(
        0,
        (countLettersAndNumbers - 12) * RectangleConstants.PIXELS_PER_CHARACTER
      );
      console.log("additional width: ", this.additionalWidth);
    } else {
      this.additionalWidth = 0;
    }
  }

  calculateFontSize() {
    let baseFontSize = this.height / 2.99;
    let k = 0.0014;
    this.fontSize = baseFontSize / (1 + k * this.width);
  }

  isPointInsideOfNode(x, y) {
    return (
      x >= this.x - this.actualWidth / 2 &&
      x <= this.x + this.actualWidth / 2 &&
      y >= this.y - this.height / 2 &&
      y <= this.y + this.height / 2
    );
  }

  setText(newText) {
    if (newText.length > RectangleConstants.RECTANGLE_MAX_CHARACTERS) {
      newText = newText.substring(
        0,
        RectangleConstants.RECTANGLE_MAX_CHARACTERS
      );
    }
    this.text = newText;
    this.addWidthBasedOnTextLength();
    this.calculateFontSize();
  }

  toJSON() {
    return {
      ...super.toJSON(),
      width: this.width,
      height: this.height,
      cornerRadii: this.cornerRadii,
    };
  }
}
