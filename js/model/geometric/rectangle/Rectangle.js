import Node from "../node/Node.js";
import * as RectangleConstants from "../../../constants/RectangleConstants.js";
import RectangleRenderer from "../../../engine/rendrers/RectangleRenderer.js";

export default class Rectangle extends Node {
  constructor(
    x = 0,
    y = 0,
    width = RectangleConstants.BASE_RECTANGLE_WIDTH,
    height = RectangleConstants.BASE_RECTANGLE_HEIGHT,
    text = RectangleConstants.NODE_DEFAULT_NAME,
    fillColor = RectangleConstants.BASE_RECTANGLE_COLOR,
    borderColor = "black",
    textColor = "black",
    borderWidth = RectangleConstants.BASE_RECTANGLE_BORDER_WIDTH,
    cornerRadii = [0, 0, 0, 0] // [top-left, top-right, bottom-right, bottom-left]
  ) {
    super(x, y, text, fillColor, borderColor, textColor, borderWidth);
    this.originalWidth = width;
    this.height = height;
    this.cornerRadii = cornerRadii;
    this.additionalWidth = 0;
    this.setText(text);
    this.calculateFontSize();
  }

  clone() {
    const clone = new Rectangle(
      this.x,
      this.y,
      this.originalWidth,
      this.height,
      this.text,
      this.fillColor,
      this.borderColor,
      this.textColor,
      this.borderWidth,
      [...this.cornerRadii]
    );
    clone.id = this.id;
    clone.collapsed = this.collapsed;
    this.children.forEach((child) => {
      const childClone = child.clone();
      clone.addChildNode(childClone);
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

  render(context) {
    const renderer = new RectangleRenderer(context);
    renderer.render(this);
  }
}
