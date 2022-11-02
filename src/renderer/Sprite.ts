interface Sprite {
  height: number;
  width: number;
  pivot: {
    position: {
      x: number;
      y: number;
    };
    x: number;
    y: number;
  };
  image: HTMLImageElement;
  imageSource: string;
  name: string;
}

class Sprite {
  constructor(options: {
    imageSource: string;
    name: string;
    position: {
      x: number;
      y: number;
    };
  }) {
    this.image = new Image();
    this.image.src = options.imageSource;
    this.width = 0;
    this.height = 0;
    this.position = options.position;
    this.name = options.name;
    this.imageSource = options.imageSource;
    this.pivot = {
      position: {
        x: 0,
        y: 0,
      },
      x: 0.5,
      y: 0.5,
    };
    this.init();
  }
  init() {
    this.height = this.image.height;
    this.width = this.image.width;
    // this.height = 100;
    // this.width = 100;
  }
  set position(properties: { x: number; y: number }) {
    this.position.x = properties.x;
    this.position.y = properties.y;
  }

  size(w: number, h: number) {
    this.width = w;
    this.height = h;
  }
  get position() {
    return this.position;
  }

  render() {
    // this.#ctx.drawImage(
    //   this.image, //image
    //   0, //image source x
    //   0, //image source y
    //   this.image.width, //image sprite width
    //   this.image.height, //image sprite height
    //   this.#position.x, //position x
    //   this.#position.y, // position y
    //   this.width,
    //   this.height
    // );
  }
  isInsideBoundary(e: MouseEvent) {
    return (
      e.offsetX >= this.position.x &&
      e.offsetX <= this.position.x + this.width &&
      e.offsetY >= this.position.y &&
      e.offsetY <= this.position.y + this.height
    );
  }
}

export default Sprite;
