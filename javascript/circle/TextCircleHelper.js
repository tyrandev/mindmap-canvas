const MAX_CHARACTER_NUMBER_CIRCLE = 32;

export default class TextCircleHelper {
  static calculateFontSize(text, radius) {
    const textLength = text.length;
    if (textLength <= 8) {
      return Math.floor(radius / 2.85);
    } else if (textLength <= 12) {
      return Math.floor(radius / 3);
    } else {
      return Math.floor(radius / 3.25);
    }
  }

  static measureTextWidth(text, fontSize) {
    // Dummy context to measure text width without actually rendering on canvas
    const dummyCanvas = document.createElement("canvas");
    const dummyContext = dummyCanvas.getContext("2d");
    dummyContext.font = `${fontSize}px Arial`;
    return dummyContext.measureText(text).width;
  }

  static limitTextCharacterNumber(newText) {
    return newText.substring(0, MAX_CHARACTER_NUMBER_CIRCLE);
  }

  static splitTextIntoLines(text, radius, fontSize) {
    const words = text.split(" ");
    const lines = [];
    let currentLine = "";

    words.forEach((word, index) => {
      const testLine = currentLine + word + " ";
      const lineWidth = this.measureTextWidth(testLine, fontSize);
      if (lineWidth > radius * 2 && index > 0) {
        lines.push(currentLine.trim());
        currentLine = word + " ";
      } else {
        currentLine = testLine;
      }
    });

    lines.push(currentLine.trim());
    return lines;
  }
}
