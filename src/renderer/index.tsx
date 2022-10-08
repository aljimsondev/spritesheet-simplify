interface Engine {
  sprites: HTMLImageElement[];
  animationEnded: boolean;
  frameCount: number;
  maxFrame: number;
  context: CanvasRenderingContext2D | null;
  interval: number;
  fps: number;
  lastTime: number;
  counter: number;
  RAF: any;
  height: number;
  width: number;
  onEndAnimation: () => void;
  onStartAnimation: () => void;
  onAnimationReady: () => void;
}

// //TODO need to try try to use promises when rendering images works well in the preview
// //! need to implement using localStorage for images in order to support page refresh when renders bugged
// //! create state signififying ready state in animation to rerender component

class Engine {
  #buffer: null | HTMLImageElement;
  #startAnimation: boolean = false;
  #spriteWidth: number = 0;
  #spriteHeight: number = 0;
  #readyState: boolean = false;

  constructor(canvasHeight: number, canvasWidth: number) {
    this.height = canvasHeight; //height of the canvas
    this.width = canvasWidth; //width of the canvas
    this.animationEnded = false;
    this.frameCount = 0;
    this.context = null;
    this.fps = 60; //by default
    this.interval = 1000 / this.fps;
    this.lastTime = 0;
    this.counter = 0;
    this.RAF = null;
    this.#buffer = null;
    this.onEndAnimation = () => {};
    this.onStartAnimation = () => {};
    this.onAnimationReady = () => {};
  }
  setContext(context: CanvasRenderingContext2D) {
    this.context = context;
  }
  /**
   *Load the images to be animated
   * @param images - array of sprites to be animated
   */
  loadAssets(images: HTMLImageElement[]) {
    if (images && images.length > 0) {
      this.maxFrame = images.length - 1;
      const canvas = document.createElement("canvas");
      canvas.id = "canvas-preview-hidden";
      canvas.width = this.#getWidth(images);
      canvas.height = this.#getHeight(images[0]);
      const ctx = canvas.getContext("2d")!;
      this.#drawImagesInCanvas(ctx, images).then(() => {
        const image = document.createElement("img");
        image.src = canvas.toDataURL();
        this.#buffer = image; //use this image to play animation
        this.onAnimationReady();
      });
    }
  }

  #drawImagesInCanvas(
    context: CanvasRenderingContext2D,
    images: HTMLImageElement[]
  ) {
    return new Promise((resolve, reject) => {
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
        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
  }
  #getWidth(images: HTMLImageElement[]) {
    /**
     * sprites should be same width basically so we will only need 1 instance of image to calculate total width
     */
    if (images.length > 0) {
      let image = images[0];
      this.#spriteWidth = image.width; //set the sprite width for animation
      const totalWidth = image.width * images.length;
      return totalWidth;
    }
    return 0;
  }
  #getHeight(image: HTMLImageElement) {
    this.#spriteHeight = image.height; //set the sprite height for animation
    return image.height;
  }
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
  #calculateAspectRatioFit(
    srcWidth: number,
    srcHeight: number,
    maxWidth: number,
    maxHeight: number
  ) {
    var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

    return { width: srcWidth * ratio, height: srcHeight * ratio };
  }
  draw() {
    //start animation
    const { height, width } = this.#calculateAspectRatioFit(
      this.#spriteWidth,
      this.#spriteHeight,
      this.width,
      this.height
    );

    if (this.#buffer) {
      this.context?.drawImage(
        this.#buffer, //image
        this.frameCount * this.#spriteWidth, //image source x
        0 * this.#spriteHeight, //image source y
        this.#spriteWidth, //image sprite width
        this.#spriteHeight, //image sprite height
        0, //position x
        0, // position y
        width, //custom size width
        height * 0.6 //custom size height
      );
    }
  }

  clearCanvas() {
    this.context?.clearRect(0, 0, this.#spriteWidth, this.#spriteHeight);
  }

  start() {
    this.#startAnimation = true;
    console.log("clicked");
    this.onStartAnimation();
  }
  reset() {
    //reset properties
    this.#startAnimation = false;
  }
  animate(time: number) {
    this.clearCanvas();

    let deltaTime = time - this.lastTime;
    this.lastTime = time;

    if (this.maxFrame > 0) {
      if (this.frameCount >= this.maxFrame) {
        this.frameCount = 0;
        this.onEndAnimation();
        this.#startAnimation = false;
      } else {
        if (this.counter > this.interval) {
          this.counter = 0;
          if (this.#startAnimation) {
            this.frameCount++;
          }
        } else {
          this.counter += deltaTime;
        }
      }
    }
    this.draw();
    this.RAF = requestAnimationFrame(this.animate.bind(this));
  }
  exit() {
    //clear animation
    cancelAnimationFrame(this.RAF);
  }
}

export default Engine;
