import { calculateAspectRatioFit } from "./CalculateImageRatio";

interface Minify {
  maxHeight: number;
  maxWidth: number;
  images: HTMLImageElement[][];
  minifyImages: HTMLImageElement[][];
}

class Minify {
  constructor(maxHeight: number, maxWidth: number) {
    this.maxHeight = maxHeight;
    this.maxWidth = maxWidth;
  }
  load(images: HTMLImageElement[]) {
    for (let col = 0; col < images.length; col++) {}
  }
  minify(images: HTMLImageElement[]) {
    if (images.length > 0) {
      const { height, width } = this.getNewImageProperties(images[0]);
    }
  }
  getNewImageProperties(image: HTMLImageElement) {
    return calculateAspectRatioFit(
      image.width,
      image.height,
      this.maxWidth,
      this.maxHeight
    );
  }
}

export default Minify;
