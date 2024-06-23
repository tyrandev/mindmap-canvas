export default class CircleColorHelper {
  // Function to darken a given hex color by a specified percentage
  static darkenColor(color, percent) {
    // Convert hex to RGB
    let num = parseInt(color.slice(1), 16);
    let r = (num >> 16) * (1 - percent / 100);
    let b = ((num >> 8) & 0x00ff) * (1 - percent / 100);
    let g = (num & 0x0000ff) * (1 - percent / 100);

    // Ensure values are within valid range
    r = Math.min(Math.max(0, r), 255);
    g = Math.min(Math.max(0, g), 255);
    b = Math.min(Math.max(0, b), 255);

    // Convert back to hex
    return "#" + (g | (b << 8) | (r << 16)).toString(16).padStart(6, "0");
  }

  // Function to lighten a given hex color by a specified percentage
  static lightenColor(color, percent) {
    // Convert hex to RGB
    let num = parseInt(color.slice(1), 16);
    let r = (num >> 16) + percent;
    let b = ((num >> 8) & 0x00ff) + percent;
    let g = (num & 0x0000ff) + percent;

    // Ensure values are within valid range
    r = Math.min(Math.max(0, r), 255);
    g = Math.min(Math.max(0, g), 255);
    b = Math.min(Math.max(0, b), 255);

    // Convert back to hex
    return "#" + (g | (b << 8) | (r << 16)).toString(16).padStart(6, "0");
  }

  // Function to increase the saturation of a given hex color by a specified percentage
  static saturateColor(color, percent) {
    // Convert hex to HSL
    let hsl = this.rgbToHsl(color);

    // Adjust saturation
    hsl[1] = Math.min(100, hsl[1] + percent);

    // Convert back to hex
    return this.hslToHex(hsl);
  }

  // Helper function: Convert RGB to HSL
  static rgbToHsl(color) {
    let num = parseInt(color.slice(1), 16);
    let r = (num >> 16) / 255;
    let g = ((num >> 8) & 0x00ff) / 255;
    let b = (num & 0x0000ff) / 255;

    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  }

  // Helper function: Convert HSL to hex
  static hslToHex(hsl) {
    let [h, s, l] = hsl;
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s;
    let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    let m = l - c / 2;
    let r, g, b;

    if (h >= 0 && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (h >= 60 && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (h >= 120 && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (h >= 180 && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (h >= 240 && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else {
      r = c;
      g = 0;
      b = x;
    }

    r = Math.round((r + m) * 255)
      .toString(16)
      .padStart(2, "0");
    g = Math.round((g + m) * 255)
      .toString(16)
      .padStart(2, "0");
    b = Math.round((b + m) * 255)
      .toString(16)
      .padStart(2, "0");

    return `#${r}${g}${b}`;
  }
}
