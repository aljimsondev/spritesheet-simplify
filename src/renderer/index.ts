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
}

class Renderer {
  constructor() {
    this.images = [];
    this.init();
  }

  setImageSpriteProps(args: this["imageSpriteProps"]) {
    this.imageSpriteProps = args;
  }
  init() {
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d")!;
  }
  async loadBuffers(buffers: this["buffers"]) {
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
  async loadRowData(imagesArray: HTMLImageElement[], posY: number) {
    let startingPositionX = 0; //entry point of rendering
    for (let i = 0; i < imagesArray.length; i++) {
      const image = imagesArray[i];
      if (this.imageSpriteProps.imageWidth) {
        startingPositionX = this.imageSpriteProps.imageWidth;
      } else {
        startingPositionX = image.width;
      }
      this.context.drawImage(
        image, //image
        0, //image source x
        0, //image source y
        image.width, //image sprite width
        image.height, //image sprite height
        i * startingPositionX, //position x
        posY, // position y
        this.imageSpriteProps.imageWidth || image.width,
        this.imageSpriteProps.imageHeight || image.height
      );
      if (this.imageSpriteProps.borderLine) {
        this.context.strokeRect(
          i * startingPositionX,
          posY,
          this.imageSpriteProps.imageWidth || image.width,
          this.imageSpriteProps.imageHeight || image.height
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
  download(fileName: string) {
    if (this.images.length > 0) {
      // const blob = this.canvas.toDataURL("image/png");
      // const a = document.createElement("a");
      // a.download = `${fileName || "spritesheet"}.png`;
      // a.href = blob;
      // a.click();
    }
  }
  async render(parentEl: HTMLElement) {
    return new Promise<HTMLCanvasElement>((resolve, reject) => {
      try {
        if (this.images.length > 0) {
          this.canvas.width = this.getCanvasWidth();
          this.canvas.height = this.getCanvasHeight();

          let currentPositionY = 0;

          for (let row = 0; row < this.images.length; row++) {
            this.loadRowData(this.images[row], currentPositionY);

            if (this.images.length > 0) {
              //consist of more than 1 row, add padding  to give space of each column sprites
              if (this.imageSpriteProps.imageHeight) {
                currentPositionY +=
                  this.imageSpriteProps.imageHeight +
                  this.imageSpriteProps.padding;
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
        console.log(parentEl.childElementCount);
        // if(parentEl.childElementCount > 0){
        //   parentEl.removeChild()
        // }
        // resolve(parentEl.appendChild(this.canvas));
      } catch (e) {
        reject(e);
      }
    });
  }
  async destroy() {}
}

export default Renderer;
