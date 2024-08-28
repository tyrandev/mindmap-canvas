const DEFAULT_COLOR_PICKER_COLOR = "#ffffff";

class ColorPicker {
  constructor() {
    if (ColorPicker.instance) {
      return ColorPicker.instance;
    }
    this.colorPickerElement = document.getElementById("color-picker");
    this.colorPickerElement.value = DEFAULT_COLOR_PICKER_COLOR;
    this.colorMode = "fill"; // Default mode
    this.colorPickerElement.addEventListener(
      "input",
      this.onColorChange.bind(this)
    );
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

  onColorChange(event) {
    const selectedColor = event.target.value;
    const colorChangeEvent = new CustomEvent("colorChange", {
      detail: { color: selectedColor },
    });
    this.colorPickerElement.dispatchEvent(colorChangeEvent);
  }
}

const instance = new ColorPicker();
export default instance;
