import { BufferData } from "../Components/types";

/**
 * HOW TO MAKE IMAGES RESIZEABLE
 * solution 1: add reference to that row and  use it when updating rows later
 */

interface Renderer {
  canvas: HTMLCanvasElement;
  imageSpriteProps: {
    padding: number;
    imageWidth: number;
    imageHeight: number;
    borderLine: boolean;
    borderWidth: number;
    borderColor: string;
    x?: number;
    y?: number;
  };
}

import Minify from "./MinifyImages";

class Renderer {
  #images: HTMLImageElement[][] = []; //for 2d spritesheet array
  #maxPadding: number = 100;
  #defaultBorderColor: string = "#000000";
  #defaultBorderWidth: number = 1;
  #posYArray: number[] = [];
  #buffers: BufferData[][] = [];
  #context: CanvasRenderingContext2D | null = null;
  #JSONData: {
    frames: any;
    properties?: {
      height: number;
      width: number;
      version: number;
    };
  } = { frames: {} };
  #spritesheetsRowData: {
    posY: number;
    height: number;
    width: number;
    name: string;
  }[] = [];
  #minify = new Minify(300, 300);
  constructor() {
    this.#init();
  }

  setImageSpriteProps(args: {
    padding: number;
    imageWidth: number;
    imageHeight: number;
    borderLine: boolean;
    borderWidth: number;
    borderColor: string;
    x?: number;
    y?: number;
  }) {
    this.imageSpriteProps = args;
  }
  #init() {
    this.canvas = document.createElement("canvas");
    this.canvas.id = "renderer-canvas";
    this.#context = this.canvas.getContext("2d")!;
  }
  /**
   * Load the base64 data and convert it to HTML images
   * @param buffers
   * @returns
   */
  async loadBuffers(buffers: BufferData[][]) {
    if (buffers.length <= 0) return;

    return new Promise<boolean>((resolve, reject) => {
      try {
        let counter = 0;
        this.#buffers = buffers;
        for (let row = 0; row < buffers.length; row++) {
          this.#images[row] = [];
          for (let col = 0; col < buffers[row].length; col++) {
            const image = new Image();
            image.src = buffers[row][col].data as string;
            image.alt = buffers[row][col].name;
            this.#images[row][col] = image; //assigning image to indexes
          }
          counter++;
        }
        if (counter >= buffers.length) {
          resolve(true);
        }
        resolve(false);
      } catch (e) {
        reject(e);
      }
    });
  }
  /**
   * Load the base64 data and convert it to HTML image
   * @param buffer
   * @returns
   */
  /**
   * Loads the images row and render it in the canvas
   */
  async #loadColumnData(
    imagesArray: HTMLImageElement[],
    context: CanvasRenderingContext2D,
    posY: number,
    options?: {
      borderLine?: boolean;
      borderWidth?: number;
      borderColor?: string;
      customWidth?: number;
      customHeight?: number;
    }
  ) {
    let startingPositionX = 0; //entry point of rendering horizontally
    for (let i = 0; i < imagesArray.length; i++) {
      const image = imagesArray[i];
      if (options?.customWidth) {
        startingPositionX = options.customWidth;
      } else {
        startingPositionX = image.width;
      }
      context.drawImage(
        image, //image
        0, //image source x
        0, //image source y
        image.width, //image sprite width
        image.height, //image sprite height
        i * startingPositionX, //position x
        posY, // position y
        options?.customWidth || image.width,
        options?.customHeight || image.height
      );
      if (options?.borderLine) {
        context.lineWidth = options?.borderWidth || this.#defaultBorderWidth;
        context.strokeStyle = options?.borderColor || this.#defaultBorderColor;
        context.strokeRect(
          i * startingPositionX,
          posY,
          image.width,
          image.height
        );
      }
    }
  }

  /**
   * Create a spritesheet from columns from the given input
   */
  #createAnimationSpriteSheet(props: {
    sprites: HTMLImageElement[];
    posY: number;
    arrayIndex: number;
  }): HTMLImageElement {
    const { sprites, posY, arrayIndex } = props;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const image = new Image();
    if (sprites.length > 0) {
      canvas.width = this.#getTotalWidth(sprites);
      canvas.height = sprites[0].height;
      this.#loadColumnData(sprites, ctx, 0);
      image.src = canvas.toDataURL();
      image.alt = sprites[0].alt;
      image.dataset.props = JSON.stringify({
        height: sprites[0].height,
        width: sprites[0].width,
        name: sprites[0].alt,
        posY: posY,
        arrayIndex: arrayIndex,
      });
    }
    return image;
  }
  async createSpritesheets(): Promise<HTMLImageElement[]> {
    return this.#images.map((row, y) => {
      return this.#createAnimationSpriteSheet({
        sprites: row,
        posY: this.#posYArray[y],
        arrayIndex: y,
      });
    });
  }
  donwloadDataJSON() {
    let prevName = "";
    let name = "";
    const result = this.#spritesheetsRowData.reduce((obj, cur, i) => {
      name = cur.name.split(".png")[0];
      if (name === prevName) {
        name = `${name}(${i + 1})`;
      }
      prevName = name;
      return {
        ...obj,
        [name]: { height: cur.height, width: cur.width, posY: cur.posY },
      };
    }, {});
  }
  /**
   *
   * @param index - index of the array which changes will be applied to
   */
  async updateColumnData(index: number, height: number, width: number) {
    //update buffers instead of images and return value should be a base64 data
    return new Promise((resolve, reject) => {
      try {
        const col = this.#images[index];
        if (col && col.length > 0) {
          const newColumn = col.map((img) => {
            return this.#clone({ image: img, width: width, height: height });
          });
          this.#images[index] = newColumn;
          resolve(true);
        }
        resolve(false);
      } catch (e) {
        reject(e);
      }
    });
  }
  /**
   * Clone images with new given properties
   * @param props
   * @returns clone image
   */
  #clone(props: {
    height: number;
    width: number;
    image: HTMLImageElement;
    options?: {};
  }) {
    const { image, width, height } = props;
    const canvas = document.createElement("canvas")!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = width;
    canvas.height = height; //renders all
    ctx.drawImage(
      image, //image
      0, //image source x
      0, //image source y
      image.width, //image sprite width
      image.height, //image sprite height
      0, //position x
      0, // position y
      width,
      height
    );
    const buffer = canvas.toDataURL();
    const newImage = new Image();
    newImage.alt = image.alt;
    newImage.src = buffer;
    return newImage;
  }
  getYPositions() {
    return this.#posYArray;
  }

  /**
   * Get the total occopied width of the images in the canvas
   * @returns Total Width
   */
  #getTotalWidth(
    imagesArray: HTMLImageElement[],
    options?: {
      customWidth?: number;
    }
  ) {
    if (imagesArray.length > 0) {
      const totalWidthCombine = imagesArray.reduce((total, img: any) => {
        if (options?.customWidth) {
          return (total += options.customWidth);
        } else {
          return (total += parseFloat(img.width));
        }
      }, 0);
      return totalWidthCombine;
    }
    return 0;
  }

  /**
   * Get the total occopied height of the images in the canvas
   * @returns Totalheight
   */
  getCanvasHeight() {
    let totalHeight = 0;
    let padding = 0;
    if (
      isNaN(this.imageSpriteProps.padding) ||
      typeof this.imageSpriteProps.padding !== "number" ||
      this.imageSpriteProps.padding > this.#maxPadding
    ) {
      padding = 0;
    } else {
      padding = this.imageSpriteProps.padding;
    }

    for (let col = 0; col < this.#images.length; col++) {
      let imageHeight = this.#images[col][0].height; //first index of the array

      if (this.#images.length > 1) {
        //more than 1 column
        if (this.imageSpriteProps.imageHeight) {
          totalHeight += this.imageSpriteProps.imageHeight + padding; //custom height
        }
        totalHeight += imageHeight + padding; //original image height
      } else if (this.#images.length === 1) {
        //only 1 column means no padding applied
        if (this.imageSpriteProps.imageHeight) {
          totalHeight += this.imageSpriteProps.imageHeight; //custom height
        }
        totalHeight += imageHeight; //original image height
      }
    }
    return totalHeight;
  }
  /**
   * Get the highest width of the images in the canvas
   * @returns Total Width
   */
  getCanvasWidth() {
    let highestWidth = 0;
    if (this.#images.length <= 0) return 0;
    for (let i = 0; i < this.#images.length; i++) {
      let width = this.#getTotalWidth(this.#images[i], {
        customWidth: this.imageSpriteProps.imageWidth,
      });
      if (width > highestWidth) {
        highestWidth = width;
      }
    }

    return highestWidth;
  }
  /**
   * Download the spritesheet
   * @param fileName
   * @returns
   */
  async download(fileName: string) {
    return new Promise<boolean>((resolve, reject) => {
      try {
        if (this.#images.length > 0) {
          const blob = this.canvas.toDataURL("image/png");
          const a = document.createElement("a");
          a.download = `${fileName || "spritesheet"}.png`;
          a.href = blob;
          a.click();

          return resolve(true);
        }
        return resolve(false);
      } catch (e) {
        reject(e);
      }
    });
  }
  /**
   * Draw the images in the canvas
   */
  async #drawCanvas() {
    if (this.#images.length > 0) {
      this.canvas.width = this.getCanvasWidth();
      this.canvas.height = this.getCanvasHeight();
      let colPadding = 0;
      let currentPositionY = 0;

      for (let row = 0; row < this.#images.length; row++) {
        this.#posYArray[row] = currentPositionY;
        //add row image data to array to be exported as JSON
        this.#spritesheetsRowData[row] = {
          height: this.#images[row][0].height,
          width: this.#images[row][0].width,
          name: this.#images[row][0].alt,
          posY: currentPositionY,
        };
        this.#minify.minify(this.#images[row]);
        this.#loadColumnData(
          this.#images[row],
          this.#context!,
          currentPositionY,
          {
            borderLine: this.imageSpriteProps.borderLine,
            borderWidth: this.imageSpriteProps.borderWidth,
            borderColor: this.imageSpriteProps.borderColor,
          }
        );

        if (
          isNaN(this.imageSpriteProps.padding) ||
          typeof this.imageSpriteProps.padding !== "number" ||
          this.imageSpriteProps.padding > this.#maxPadding
        ) {
          colPadding = 0;
        } else {
          colPadding = this.imageSpriteProps.padding;
        }

        if (this.#images.length > 1) {
          //consist of more than 1 row, add padding  to give space of each column sprites
          if (this.imageSpriteProps.imageHeight) {
            currentPositionY += this.imageSpriteProps.imageHeight + colPadding;
          } else {
            currentPositionY += this.#images[row][0].height + colPadding;
          }
        } else if (this.#images.length === 1) {
          //only 1 row
          if (this.imageSpriteProps.imageHeight) {
            currentPositionY += this.imageSpriteProps.imageHeight;
          } else {
            currentPositionY += this.#images[row][0].height;
          }
        }
      }
    } else {
      this.#context?.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.canvas.width = 0;
      this.canvas.height = 0;
    }
  }

  /**
   * Render the canvas the in the parent element in the DOM
   * `NOTE:Parent Element should be empty`
   * @param parentEl - Parent Element
   * @returns
   */
  async render(parentEl: HTMLElement) {
    return new Promise<boolean>((resolve, reject) => {
      try {
        this.#drawCanvas();
        if (parentEl.childElementCount > 0) {
          for (let key in Object.keys(parentEl.childNodes)) {
            //remove all children there is
            parentEl.removeChild(parentEl.childNodes[key]);
          }
          parentEl.appendChild(this.canvas);
          return;
        }
        parentEl.appendChild(this.canvas);
        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
  }
}

export default Renderer;
