import {
  fetchToLocalStorage,
  saveToLocalStorage,
} from "../helpers/LocalStorageHelper";
import { BufferData } from "../Components/types";

interface Renderer {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  imageSpriteProps: {
    padding: number;
    imageWidth: number;
    imageHeight: number;
    borderLine: boolean;
    borderWidth: number;
  };
  buffers: BufferData[][];
  images: HTMLImageElement[][];
  imagesArray: HTMLImageElement[];
  focus: boolean;
  _RAF: any;
  buffer: BufferData[];
}

class Renderer {
  #MAX_ZOOM = 1;
  #MIN_ZOOM = 0.1;
  #ZOOM_SENSITIVITY = 0.0005;
  #scale = 1;
  constructor() {
    this.images = []; //for 2d spritesheet array
    this.imagesArray = []; //for single row images for animation spritesheet
    this.#init();
    this._RAF = null;
  }

  setImageSpriteProps(args: {
    padding: number;
    imageWidth: number;
    imageHeight: number;
    borderLine: boolean;
    borderWidth: number;
  }) {
    this.imageSpriteProps = args;
  }
  #init() {
    this.canvas = document.createElement("canvas");
    this.canvas.id = "canvas";
    this.context = this.canvas.getContext("2d")!;
  }
  /**
   * Load the base64 data and convert it to HTML images
   * @param buffers
   * @returns
   */
  async loadBuffers(buffers: BufferData[][]) {
    if (buffers.length <= 0) return;

    //fetch scale if there is
    const localScale = fetchToLocalStorage("scale");
    if (localScale) {
      this.#scale = JSON.parse(localScale);
    }

    return new Promise<boolean>((resolve, reject) => {
      try {
        let counter = 0;
        this.buffers = buffers;
        for (let row = 0; row < buffers.length; row++) {
          this.images[row] = [];
          for (let col = 0; col < buffers[row].length; col++) {
            const image = new Image();
            image.src = buffers[row][col].data as string;
            image.alt = buffers[row][col].name;
            this.images[row][col] = image; //assigning image to indexes
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
  async loadBuffer(buffer: BufferData[]) {
    if (buffer.length <= 0) return;

    return new Promise<boolean>((resolve, reject) => {
      try {
        let counter = 0;
        this.buffer = buffer;
        for (let row = 0; row < buffer.length; row++) {
          const image = new Image();
          image.src = buffer[row].data as string;
          image.alt = buffer[row].name;
          this.imagesArray[row] = image; //assigning image to indexes
          counter++;
        }
        if (counter >= buffer.length) {
          resolve(true);
        }
        resolve(false);
      } catch (e) {
        reject(e);
      }
    });
  }
  /**
   * Loads the images row and render it in the canvas
   * @param imagesArray
   * @param posY
   */
  async loadRowData(
    imagesArray: HTMLImageElement[],
    context: CanvasRenderingContext2D,
    posY: number,
    options?: {
      imageWidth?: number;
      imageHeight?: number;
      borderLine?: boolean;
      borderWidth: number;
    }
  ) {
    let startingPositionX = 0; //entry point of rendering
    for (let i = 0; i < imagesArray.length; i++) {
      const image = imagesArray[i];
      if (options?.imageWidth) {
        startingPositionX = options.imageWidth;
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
        options?.imageWidth || image.width,
        options?.imageHeight || image.height
      );
      if (options?.borderLine) {
        context.lineWidth = options.borderWidth;
        context.strokeRect(
          i * startingPositionX,
          posY,
          options?.imageWidth || image.width,
          options?.imageHeight || image.height
        );
      }
    }
  }

  createAnimationSpriteSheet(sprites: HTMLImageElement[]): HTMLImageElement {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const image = new Image();

    if (sprites.length > 0) {
      canvas.width = this.getTotalWidth(sprites);
      canvas.height = sprites[0].height;
      this.loadRowData(sprites, ctx, 0);

      image.src = canvas.toDataURL();
      image.alt = sprites[0].alt;
      image.dataset.props = JSON.stringify({
        height: sprites[0].height,
        width: sprites[0].width,
        name: sprites[0].alt,
      });
    }
    return image;
  }
  async createSpritesheets(): Promise<HTMLImageElement[]> {
    return this.images.map((row) => {
      return this.createAnimationSpriteSheet(row);
    });
  }

  resize(e: WheelEvent) {
    let zoomScale = e.deltaY * this.#ZOOM_SENSITIVITY;

    if (this.#scale <= this.#MIN_ZOOM) {
      this.#scale = this.#MIN_ZOOM;
    } else if (this.#scale >= this.#MAX_ZOOM) {
      this.#scale = this.#MAX_ZOOM;
    }
    this.#scale += zoomScale;
    this.canvas.style.transform = `scale(${this.#scale})`;
  }
  /**
   * Save the old scaling in local storage to usage later
   */
  resizeEnd() {
    saveToLocalStorage("scale", JSON.stringify(this.#scale));
  }

  /**
   * Get the total occopied width of the images in the canvas
   * @returns Total Width
   */
  getTotalWidth(
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

    for (let col = 0; col < this.images.length; col++) {
      let imageHeight = this.images[col][0].height; //first index of the array

      if (this.images.length > 0) {
        //more than 1 column
        if (this.imageSpriteProps.imageHeight) {
          totalHeight +=
            this.imageSpriteProps.imageHeight + this.imageSpriteProps.padding; //custom height
        }
        totalHeight += imageHeight + this.imageSpriteProps.padding; //original image height
      } else if (this.images.length === 1) {
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
    if (this.images.length <= 0) return 0;
    for (let i = 0; i < this.images.length; i++) {
      let width = this.getTotalWidth(this.images[i], {
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
        if (this.images.length > 0) {
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
  async drawCanvas() {
    if (this.images.length > 0) {
      this.canvas.width = this.getCanvasWidth();
      this.canvas.height = this.getCanvasHeight();
      this.canvas.style.transform = `scale(${this.#scale})`;

      let currentPositionY = 0;

      for (let row = 0; row < this.images.length; row++) {
        this.loadRowData(this.images[row], this.context, currentPositionY, {
          imageWidth: this.imageSpriteProps.imageWidth,
          imageHeight: this.imageSpriteProps.imageHeight,
          borderLine: this.imageSpriteProps.borderLine,
          borderWidth: this.imageSpriteProps.borderWidth,
        });

        if (this.images.length > 0) {
          //consist of more than 1 row, add padding  to give space of each column sprites
          if (this.imageSpriteProps.imageHeight) {
            currentPositionY +=
              this.imageSpriteProps.imageHeight + this.imageSpriteProps.padding;
          } else {
            currentPositionY +=
              this.images[row][0].height + this.imageSpriteProps.padding;
          }
        } else if (this.images.length === 1) {
          //only 1 row
          if (this.imageSpriteProps.imageHeight) {
            currentPositionY += this.imageSpriteProps.imageHeight;
          } else {
            currentPositionY += this.images[row][0].height;
          }
        }
      }
    } else {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.canvas.width = 0;
      this.canvas.height = 0;
    }
  }
  /**
   * Render the canvas the in the parent element in the DOM
   * @param parentEl - Parent Element
   * @returns
   */
  async render(parentEl: HTMLElement) {
    return new Promise<boolean>((resolve, reject) => {
      try {
        this.drawCanvas();
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
