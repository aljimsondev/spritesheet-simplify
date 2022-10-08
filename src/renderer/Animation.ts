import Renderer from ".";

interface Animation {
  sprites: HTMLImageElement[];
}

class Animation extends Renderer {
  constructor() {
    super();
    this.sprites = [];
    console.log(this.images);
  }
}

export default Animation;
