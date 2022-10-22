import { BufferData } from "../types/types";

interface Renderer {
  canvas: HTMLCanvasElement;
  imageSpriteProps: {
    padding: number;
    // imageWidth: number;
    // imageHeight: number;
    borderLine: boolean;
    borderWidth: number;
    borderColor: string;
    x?: number;
    y?: number;
  };
}

class Renderer {
  #images: HTMLImageElement[][] = []; //for 2d spritesheet array
  #maxPadding: number = 100;
  #defaultBorderColor: string = "#000000";
  #defaultBorderWidth: number = 1;
  #posYArray: number[] = [];
  #buffers: BufferData[][] = [];
  #imageCache = new Map<string, HTMLImageElement[]>();
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
  constructor() {
    this.#init();
  }

  setImageSpriteProps(args: {
    padding: number;
    // imageWidth: number;
    // imageHeight: number;
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
  downloadDataJSON(fileName: string) {
    let result: any = {};
    let name = "";
    result.frames = this.#spritesheetsRowData.reduce((obj, cur, i) => {
      name =
        cur.name.split(".png")[0] +
        (Math.random() * 0xffffff).toString(16).split(".")[0];

      return {
        ...obj,
        [name]: {
          fileName: name + ".png",
          frame: {
            x: 0,
            y: cur.posY,
            w: this.#getTotalWidth(this.#images[i]),
            h: cur.height,
          },
          rotated: false,
          trimmed: false,
          sourceSize: {
            w: cur.width,
            h: cur.height,
          },
          frames: this.#buffers[i].length,
        },
      };
    }, {});
    result.meta = {
      web: "https://aljimsondev.github.io/spritesheet-simplify/",
      version: "1.0",
      image: fileName + ".png",
      format: "RGBA8888",
      size: {
        w: this.getCanvasWidth(),
        h: this.getCanvasHeight(),
      },
      scale: "1",
    };

    const d_json = JSON.stringify(result);
    const blob = new Blob([d_json], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    this.#createLink({ fileName: fileName + ".json", link: href }).click();
  }
  /**
   *
   * @param index - index of the array which changes will be applied to
   */
  updateColumnData(index: number, width: number, height: number) {
    //update buffers instead of images and return value should be a base64 data
    try {
      const col = this.#images[index];
      if (col && col.length > 0) {
        const cacheValue = this.#imageCache.get(col[0].alt);
        if (cacheValue) {
          //images in the cache
          const newColumn = cacheValue.map((img) => {
            return this.#clone({ image: img, width: width, height: height });
          });
          this.#buffers[index] = newColumn;
          return this.#buffers;
        } else {
          const newColumn = col.map((img) => {
            return this.#clone({ image: img, width: width, height: height });
          });
          this.#buffers[index] = newColumn;
          return this.#buffers;
        }
      }
    } catch (e: any) {
      throw new Error(e.message);
    }
  }
  /**
   * Clone images with new given properties
   * @param props
   * @returns clone image buffer
   */
  #clone(props: {
    height: number;
    width: number;
    image: HTMLImageElement;
    options?: {};
  }): BufferData {
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
    return { data: canvas.toDataURL(), name: image.alt };
  }
  #createLink(options: { link: string; fileName: string }) {
    const a = document.createElement("a");
    a.href = options.link;
    a.download = options.fileName;

    return a;
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
        totalHeight += imageHeight + padding;
      } else if (this.#images.length === 1) {
        totalHeight += imageHeight;
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
      let width = this.#getTotalWidth(this.#images[i]);
      if (width > highestWidth) {
        highestWidth = width;
      }
    }

    return highestWidth;
  }
  #clearCache() {
    this.#imageCache.clear();
  }
  #clearBuffer() {
    this.#buffers.length = 0;
  }
  #clearImages() {
    this.#images.length = 0;
  }
  clear() {
    this.#clearCache();
    this.#clearBuffer();
    this.#clearImages();
  }
  /**
   * Download the spritesheet
   * @param fileName
   * @returns
   */
  async download(fileName: string, options: { withJSON: boolean }) {
    return new Promise<boolean>((resolve, reject) => {
      try {
        if (this.#images.length > 0) {
          const blob = this.canvas.toDataURL("image/png");
          //create download link
          this.#createLink({
            fileName: `${fileName || "spritesheet"}.png`,
            link: blob,
          }).click();
          if (options.withJSON) {
            this.downloadDataJSON(fileName);
          }
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
        this.#imageCache.set(this.#images[row][0].alt, this.#images[row]);
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
          currentPositionY += this.#images[row][0].height + colPadding;
        } else if (this.#images.length === 1) {
          currentPositionY += this.#images[row][0].height;
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
