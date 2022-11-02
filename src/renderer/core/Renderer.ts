import { BufferData } from "../../types/types";
import Sprite from "../Sprite";

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
  displayMode: DisplayMode;
}

type DisplayMode = "horizontal" | "vertical" | "compact";

/**
 * TODO add mode
 * add sprite implementation
 * ! MUST CONTAINS 1 ONLY PARENT ARRAY CONTAINING ALL SPRITE PROPERTIES IN ABLE US TO MODIFIED SPRITE PROPERTIES EASIER
 * ! CANVAS WIDTH AND HEIGHT MUST REFLEXT IN SPRITE PROPERTIES NOT IN BUFFER
 */

class Renderer {
  #compactSprites: Sprite[][] = [];
  #buffers: BufferData[][] = [];
  #sprites: Sprite[] = [];
  #JSONData: {
    frames: any;
    properties?: {
      height: number;
      width: number;
      version: number;
    };
  } = { frames: {} };
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
        this.#buffers = buffers;
        this.loadSprites(buffers);
        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
  }
  /**
   * TODO add sprite implementation
   */
  loadSprites(buffers: BufferData[][]) {
    if (buffers.length > 0) {
      let positionX = 0;
      buffers.flat().forEach((d, index) => {
        //display horizontally
        const image = new Image();
        image.src = d.data as string;
        image.alt = d.name;
        this.#sprites[index] = new Sprite({
          imageSource: image.src,
          name: image.alt,
          position: {
            x: positionX,
            y: 0,
          },
        });
        positionX += image.width;
      });
    }
  }
  /**
   * Loads the sprite evenly
   */
  loadSpriteCompactView(buffers: BufferData[][]) {
    if (buffers.length > 0) {
      let positionX = 0;
      for (let row = 0; row < buffers.length; row++) {
        for (let col = 0; col < buffers[row].length; col++) {
          const image = new Image();
          image.src = buffers[row][col].data as string;
          image.alt = buffers[row][col].name;
          this.#compactSprites[row][col] = new Sprite({
            imageSource: image.src,
            name: image.alt,
            position: {
              x: positionX,
              y: 0,
            },
          });
          positionX += image.width;
        }
      }
    }
  }

  downloadDataJSON(
    fileName: string,
    options: { heigth: number; width: number }
  ) {
    if (!this.canvas) return;
    //TODO add this
    /**
     * {
    "frame": {"x":89,"y":2,"w":32,"h":32},
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {"x":0,"y":0,"w":32,"h":32},
    "sourceSize": {"w":32,"h":32},
    "pivot": {"x":0.5,"y":0.5}
  },
     */
    let result: any = {};
    let name = "";
    result.frames = this.#sprites.reduce((obj, cur, i) => {
      name =
        cur.name.split(".png")[0] +
        (Math.random() * 0xffffff).toString(16).split(".")[0];

      return {
        ...obj,
        [name]: {
          fileName: name + ".png",
          frame: {
            x: 0,
            y: cur.position.y,
            w: cur.width,
            h: cur.height,
          },
          rotated: false,
          trimmed: false,
          sourceSize: {
            w: cur.width,
            h: cur.height,
          },
          pivot: { x: 0.5, y: 0.5 },
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
        w: options.width,
        h: options.heigth,
      },
      scale: "1",
    };

    const d_json = JSON.stringify(result);
    const blob = new Blob([d_json], { type: "application/json" });
    const href = URL.createObjectURL(blob);
  }
  get sprites() {
    return this.#sprites;
  }
  createCompactArray(buffers: BufferData[], options: { rowCount: number }) {
    let compactArr = []; //holds the new array
    const colCount = Math.ceil(buffers.length / options.rowCount);

    for (let row = 0; row < buffers.length; row += options.rowCount) {
      for (let col = 0; col < colCount; col++) {
        compactArr[col] = buffers.slice(row, (row += options.rowCount));
      }
    }
    return compactArr;
  }
  /**
   * Vertical display of the sprites
   */
  loadSpritesVertical() {
    let spritesArray: Sprite[] = [];
    let totalHeight = 0;
    let highestWidth = 0;

    if (this.#buffers.length > 0) {
      let positionY = 0;

      this.#buffers.flat().map((d, index) => {
        const sprite = new Sprite({
          imageSource: d.data as string,
          name: d.name,
          position: {
            x: 0,
            y: positionY,
          },
        });
        spritesArray[index] = sprite;
        if (sprite.width > highestWidth) {
          highestWidth = sprite.width;
        }
        totalHeight += sprite.height;
        positionY += sprite.height;
      });
    }
    return {
      sprites: spritesArray,
      width: highestWidth,
      height: totalHeight,
    };
  }
  loadSpritesHorizontal() {
    let spritesArray: Sprite[] = [];
    let highestHeight = 0;
    let totalWidth = 0;

    if (this.#buffers.length > 0) {
      let positionX = 0;
      //display horizontally
      this.#buffers.flat().map((d, index) => {
        const sprite = new Sprite({
          imageSource: d.data as string,
          name: d.name,
          position: {
            x: positionX,
            y: 0,
          },
        });
        spritesArray[index] = sprite;
        if (sprite.height > highestHeight) {
          highestHeight = sprite.height;
        }
        totalWidth += sprite.width;
        positionX += sprite.width;
      });
    }
    return {
      sprites: spritesArray,
      width: totalWidth,
      height: highestHeight,
    };
  }
  loadSpriteInCompactView() {
    const flattenArray = this.#buffers.flat();
    let compactSprites: Sprite[][] = [];
    let totalHeight = 0;
    let highestWidth = 0;

    let compactArr = this.createCompactArray(flattenArray, {
      rowCount: Math.ceil(flattenArray.length * 0.2),
    });
    let positionY = 0;

    for (let row = 0; row < compactArr.length; row++) {
      let highestHeight = 0;
      compactSprites[row] = []; //initialize outer array
      let positionX = 0;
      let rowWidth = 0;
      for (let col = 0; col < compactArr[row].length; col++) {
        const sprite = (compactSprites[row][col] = new Sprite({
          imageSource: compactArr[row][col].data as string,
          name: compactArr[row][col].name,
          position: {
            x: positionX,
            y: positionY,
          },
        }));
        positionX += sprite.width;
        rowWidth += sprite.width;
        if (sprite.height > highestHeight) {
          highestHeight = sprite.height;
        }
      }
      if (rowWidth > highestWidth) {
        highestWidth = rowWidth;
      }
      totalHeight += highestHeight;
      positionY += highestHeight;
    }

    return {
      sprites: compactSprites,
      height: totalHeight,
      width: highestWidth,
    };
  }
  /**
   * Load the sprites according to the users input array, useful when creating animations and actions spritesheet
   */
  loadSpriteAnimView() {
    let spritesArray: Sprite[][] = [];
    let positionY = 0;
    let totalHeight = 0;
    let highestWidth = 0;
    for (let row = 0; row < this.#buffers.length; row++) {
      let highestHeight = 0;
      spritesArray[row] = []; //initialize outer array
      let positionX = 0;
      let rowWidth = 0;
      for (let col = 0; col < this.#buffers[row].length; col++) {
        const sprite = new Sprite({
          imageSource: this.#buffers[row][col].data as string,
          name: this.#buffers[row][col].name,
          position: {
            x: positionX,
            y: positionY,
          },
        });
        spritesArray[row][col] = sprite;
        positionX += sprite.width;
        rowWidth += sprite.width;
        if (sprite.height > highestHeight) {
          highestHeight = sprite.height;
        }
        if (rowWidth > highestWidth) {
          highestWidth = rowWidth;
        }
      }
      totalHeight += highestHeight;
      positionY += highestHeight;
    }
    return {
      sprites: spritesArray,
      height: totalHeight,
      width: highestWidth,
    };
  }
  getTotalOfProperties(sprites: Sprite[], key: keyof Sprite) {
    return sprites.reduce(
      (total, sprite) => (total += sprite[key] as number),
      0
    );
  }
  getHighestOfProperties(sprites: Sprite[], key: keyof Sprite) {
    let highest = 0;
    sprites.forEach((sprite) => {
      if (sprite.width > highest) {
        highest = sprite[key] as number;
      }
    });
    return highest;
  }
  unmountComponentFromDOM(el: HTMLElement) {
    if (document.contains(el)) {
      el.remove();
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
        // this.#drawCanvas();
        if (parentEl.contains(document.getElementById("renderer-canvas"))) {
          document.getElementById("renderer-canvas")?.remove();
        }
        parentEl.appendChild(this.canvas); //append new instance of canvas
        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
  }
}

export default Renderer;
