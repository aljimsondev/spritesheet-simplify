import { calculateAspectRatioFit } from "./CalculateImageRatio";
interface Animate {
  frameXRef: HTMLElement;
  readyState: boolean;
  playState: boolean;
  spritesheet: HTMLImageElement;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  posX: number;
}

//TODO there must be only 1 request animation
//each component must have a preview
//fps should be dynamic

class Animate {
  #lastTime = 0;
  #frameX = 0;
  #maxFrame = 0;
  #fps = 60;
  #interval = 1000 / this.#fps;
  #timer = 0;
  #_RAF = 0;
  #buttonRef: HTMLElement | null = null;
  #spritesheetProps = {
    height: 0,
    width: 0,
    name: "spritesheet",
  };
  #spritesheets: HTMLImageElement[] = []; //holds all the
  #queue: HTMLImageElement[] = [];
  #buttonPlayStateDisplay: { onPlayState: any; onPauseState: any } = {
    onPlayState: "pause",
    onPauseState: "play",
  };

  constructor() {
    this.readyState = false;
    this.playState = false;
    this.posX = 0;
    this.init();
  }
  init() {
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d")!;
  }
  set canvasProperties(props: { width: number; height: number }) {
    this.canvas.width = props.width;
    this.canvas.height = props.height;
  }
  setButtonState(
    ref: HTMLElement,
    onstate: { onPlayState: any; onPauseState: any }
  ) {
    if (ref) {
      this.#buttonRef = ref;
      this.#buttonPlayStateDisplay = onstate;
    }
  }
  load(spritesheet: HTMLImageElement): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        if (spritesheet.src === "data:," || spritesheet.src === "") {
          return resolve(false);
        }
        this.#spritesheetProps = JSON.parse(spritesheet.dataset.props!);
        this.spritesheet = spritesheet;
        this.readyState = true;
        //extract properties
        this.#maxFrame =
          this.spritesheet.width / this.#spritesheetProps.width - 1;

        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
  }

  #clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawImageSprites() {
    if (this.spritesheet) {
      const { height, width } = calculateAspectRatioFit(
        this.#spritesheetProps.width,
        this.#spritesheetProps.height,
        this.canvas.width,
        this.canvas.height
      );

      this.context.drawImage(
        this.spritesheet, //image
        this.#frameX * this.#spritesheetProps.width, //image source x
        0 * this.#spritesheetProps.height, //image source y
        this.#spritesheetProps.width, //image sprite width
        this.#spritesheetProps.height, //image sprite height
        0, //position x
        0, // position y
        width, // sprite size width
        height //sprite size  height
      );
    }
  }
  #end() {
    cancelAnimationFrame(this.#_RAF);
  }
  start(time: number) {
    const deltaTime = time - this.#lastTime;
    this.#lastTime = time;

    if (this.#timer > this.#interval) {
      this.#timer = 0;
      //handling spritesheet animation
      if (this.#frameX >= this.#maxFrame) {
        this.#end();
        this.playState = false;
        this.#frameX = 0;
      } else {
        this.#frameX++;
      }
    } else {
      this.#timer += deltaTime;
    }
    if (this.playState) {
      this.#_RAF = requestAnimationFrame(this.start.bind(this));
    } else {
      this.#end();
    }

    this.drawUI();
    this.#clear(); //clear canvas
    this.drawImageSprites(); //draw sprites
  }
  drawUI() {
    if (this.#buttonRef) {
    }
  }
  setState() {
    this.playState = !this.playState;
    this.start(0);
  }
  destroy() {
    this.playState = false;
    cancelAnimationFrame(this.#_RAF);
  }
  render(parentEl: HTMLElement) {
    if (parentEl.childElementCount > 0) {
      for (let key in Object.keys(parentEl.childNodes)) {
        //remove all children there is
        parentEl.removeChild(parentEl.childNodes[key]);
      }
      parentEl.appendChild(this.canvas);
      return;
    }
    parentEl.appendChild(this.canvas);
  }
}

export default Animate;
