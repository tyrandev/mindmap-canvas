const DEFAULT_COLOR_PICKER_COLOR = "#ffffff";

class ColorPicker {
  constructor() {
    // Ensure only one instance is created
    if (ColorPicker.instance) {
      return ColorPicker.instance;
    }

    // Initialize the color picker element
    this.colorPickerElement = document.getElementById("color-picker");
    this.colorPickerElement.value = DEFAULT_COLOR_PICKER_COLOR;

    // Store the instance
    ColorPicker.instance = this;
  }

  getColorPicker() {
    return this;
  }

  getElement() {
    return this.colorPickerElement;
  }

  setColor(color) {
    this.colorPickerElement.value = color;
  }

  getColor() {
    return this.colorPickerElement.value;
  }

  addEventListener(event, callback) {
    this.colorPickerElement.addEventListener(event, callback);
  }

  removeEventListener(event, callback) {
    this.colorPickerElement.removeEventListener(event, callback);
  }

  trigger() {
    this.colorPickerElement.click();
  }
}

// Create and export a single instance
const instance = new ColorPicker();
export default instance;
