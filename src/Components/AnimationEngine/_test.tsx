import React from "react";
import { useLocalStorage } from "../storage";

//create buffer from the array of images
export const useCreateBuffer = (images: HTMLImageElement[][]) => {
  const [buffer, setBuffer] = React.useState<
    Promise<HTMLImageElement | undefined>[]
  >([]);

  /**
   * Calculate the total width of all the images contained in the array
   * @param images - Array of sprites
   * @returns {Number} Total width
   */
  const getWidth = React.useCallback((images: HTMLImageElement[]) => {
    if (images.length > 0) {
      let image = images[0];
      const totalWidth = image.width * images.length;
      return totalWidth;
    }
    return 0;
  }, []);

  /**
   *  Get the height of the Image
   * @param image - HTML Image Element
   * @returns {Number} Height
   */
  const getHeight = React.useCallback(
    (image: HTMLImageElement) => {
      return image.height;
    },
    [images]
  );

  /**
   * Create buffer from the loaded images to be displayed in animation
   * @param {HTMLImageElement[]} images - Images to be create as buffer for animation
   * @returns {void}
   */
  const createBuffer = async (images: HTMLImageElement[]) => {
    if (images.length > 0) {
      const image = images[0]; //first image in the array
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d")!;
      canvas.width = getWidth(images);
      canvas.height = getHeight(image);

      // const imageBuffer = await drawImagesOnCanvas(canvas, images);
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
      //create image
      console.log(canvas.width, canvas.height);

      const newimage = new Image();
      newimage.src = canvas.toDataURL();
      newimage.dataset.props = `width=${image.width};height=${image.height};name=${image.alt}`;
      // console.log(newimage);
      return newimage;
    }
  };

  React.useEffect(() => {
    const pro = images.map((img) => {
      return createBuffer(img);
    });
    setBuffer(pro);
    return () => {
      //clean up
      setBuffer([]);
    };
  }, [images]);

  return [buffer];
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
