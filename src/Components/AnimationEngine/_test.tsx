import React from "react";
import { useLocalStorage } from "../storage";

/**
 * Conserve aspect ratio of the original region. Useful when shrinking/enlarging
 * images to fit into a certain area.
 *
 * @param {Number} srcWidth width of source image
 * @param {Number} srcHeight height of source image
 * @param {Number} maxWidth maximum available width
 * @param {Number} maxHeight maximum available height
 * @return {Object} { width, height }
 */
function calculateAspectRatioFit(
  srcWidth: number,
  srcHeight: number,
  maxWidth: number,
  maxHeight: number
) {
  var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

  return { width: srcWidth * ratio, height: srcHeight * ratio };
}

//create buffer from the array of images
export const useCreateBuffer = (images: HTMLImageElement[][]) => {
  const [buffer, setBuffer] = React.useState<
    Promise<HTMLImageElement | undefined>[]
  >([]);
  const [bufferProperties, setBufferProperties] = React.useState<
    { height: number; width: number }[]
  >([]);

  /**
   * Create buffer from the loaded images to be displayed in animation
   * @param {HTMLImageElement[]} images - Images to be create as buffer for animation
   * @returns {void}
   */
  const createBuffer = async (images: HTMLImageElement[]) => {
    if (images && images.length > 0) {
      const image = images[0]; //firs image in the array
      const canvas = document.createElement("canvas");
      canvas.width = getWidth(images);
      canvas.height = getHeight(image);
      //add buffer properties
      setBufferProperties([
        ...bufferProperties,
        { height: getHeight(image), width: image.width },
      ]);
      const imageBuffer = await drawImagesOnCanvas(canvas, images);
      return imageBuffer;
    }
  };

  /**
   * Calculate the total width of all the images contained in the array
   * @param images - Array of sprites
   * @returns {Number} Total width
   */
  const getWidth = (images: HTMLImageElement[]) => {
    if (images.length > 0) {
      let image = images[0];
      const totalWidth = image.width * images.length;
      return totalWidth;
    }
    return 0;
  };

  /**
   *  Get the height of the Image
   * @param image - HTML Image Element
   * @returns {Number} Height
   */
  const getHeight = (image: HTMLImageElement) => {
    return image.height;
  };

  /**
   * Draw sprites in the canvas
   * @param context
   * @param images
   * @returns
   */
  function drawImagesOnCanvas(
    canvas: HTMLCanvasElement,
    images: HTMLImageElement[]
  ) {
    const context = canvas.getContext("2d")!;
    return new Promise<HTMLImageElement>((resolve, reject) => {
      try {
        for (let col = 0; col < images.length; col++) {
          let img = images[col];
          context.drawImage(
            img, //image
            0, //image source x
            0, //image source y
            img.width, //image sprite width
            img.height, //image sprite height
            col * img.width, //position x
            0, // position y
            img.width,
            img.height
          );
        }
        const image = new Image();
        image.src = canvas.toDataURL();
        resolve(image);
      } catch (e) {
        reject(e);
      }
    });
  }

  React.useEffect(() => {
    console.log("loaded in custom hook");
    console.log(images.length);

    if (images.length > 0) {
      const pro = images.map((img) => {
        return createBuffer(img);
      });
      console.log(pro);
      setBuffer(pro);
    }
  }, []);

  return [buffer, bufferProperties];
};

type UseAnimationHook = (
  image: HTMLImageElement,
  config: {
    height: number;
    width: number;
    fps: number;
  }
) => [];

export const useAnimation: UseAnimationHook = (
  image,
  { height, width, fps }
) => {
  const [play, setStatus] = React.useState<boolean>(false);
  const [] = React.useState();

  return [];
};
