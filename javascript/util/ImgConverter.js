import MediaConverter from "./MediaConverter.js";

export default class ImgConverter extends MediaConverter {
  static async convertDivToImage() {
    const canvas = await this.captureContainer();
    if (!canvas) return;

    const imgData = canvas.toDataURL("image/png");
    const link = document.createElement("a");

    const fileName = this.promptFileName("png", this.defaultFileName);
    if (!fileName) return;

    link.href = imgData;
    link.download = `${fileName}.png`;
    link.click();
  }
}
