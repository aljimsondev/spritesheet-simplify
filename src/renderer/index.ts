import { BufferData } from "../Components/types";

interface Renderer {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  imageSpriteProps: {
    padding: number;
    imageWidth: number;
    imageHeight: number;
    borderLine: boolean;
  };
  buffers: BufferData[][];
  images: HTMLImageElement[][];
  spritesheets: HTMLImageElement[];
  focus: boolean;
  _RAF: any;
}

class Renderer {
  constructor() {
    this.images = [];
    this.spritesheets = [];
    this.#init();
    this.focus = false;
    this._RAF = null;
  }

  setImageSpriteProps(args: {
    padding: number;
    imageWidth: number;
    imageHeight: number;
    borderLine: boolean;
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
        context.strokeRect(
          i * startingPositionX,
          posY,
          options?.imageWidth || image.width,
          options?.imageHeight || image.height
        );
      }
    }
  }
  getCanvasWidth() {
    let highestWidth = 0;
    if (this.images.length <= 0) return 0;
    for (let i = 0; i < this.images.length; i++) {
      let width = this.getTotalWidth(this.images[i]);
      if (width > highestWidth) {
        highestWidth = width;
      }
    }

    return highestWidth;
  }
  createAnimationSpriteSheet() {
    //TODO create here
  }

  resize(e: WheelEvent) {
    let running = false;

    if (!running) {
      this.focus = true;
      this.drawCanvas(0);
    }
    running = true;
  }
  resizeEnd() {
    this.focus = false;
    cancelAnimationFrame(this._RAF);
  }
  listen(el: HTMLElement) {
    el.addEventListener("wheel", (e) => {
      if (e.ctrlKey) {
        this.resize(e);
      }
    });
  }

  getTotalWidth(imagesArray: HTMLImageElement[]) {
    if (imagesArray.length > 0) {
      const totalWidthCombine = imagesArray.reduce((total, img: any) => {
        if (this.imageSpriteProps.imageWidth) {
          let propsWidth: any = this.imageSpriteProps.imageWidth;
          return (total += propsWidth);
        } else {
          return (total += parseFloat(img.width));
        }
      }, 0);
      return totalWidthCombine;
    }

    return 0;
  }

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
  async drawCanvas(time: number) {
    if (this.images.length > 0) {
      this.canvas.width = this.getCanvasWidth();
      this.canvas.height = this.getCanvasHeight();
      let currentPositionY = 0;
      for (let row = 0; row < this.images.length; row++) {
        this.loadRowData(this.images[row], this.context, currentPositionY, {
          imageWidth: this.imageSpriteProps.imageWidth,
          imageHeight: this.imageSpriteProps.imageHeight,
          borderLine: this.imageSpriteProps.borderLine,
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
    if (this.focus) {
      this._RAF = requestAnimationFrame(this.drawCanvas.bind(this));
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
        this.drawCanvas(0);
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
