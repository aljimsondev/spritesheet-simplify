type ImageRendererOptions = {
  image: any;
  sourceX: number;
  sourceY: number;
  width: number;
  height: number;
  positionX: number;
  positionY: number;
  renderingSizeWidth: number;
  renderingSizeHeight: number;
};

type ImageRenderer = (
  context: CanvasRenderingContext2D,
  options: ImageRendererOptions
) => Promise<boolean>;

const Renderer: ImageRenderer = (
  context,
  {
    image,
    height,
    positionX,
    positionY,
    renderingSizeHeight,
    renderingSizeWidth,
    sourceX,
    sourceY,
    width,
  }
) => {
  return new Promise((resolve, reject) => {
    try {
      context.drawImage(
        image,
        sourceX,
        sourceY,
        width,
        height,
        positionX,
        positionY,
        renderingSizeWidth,
        renderingSizeHeight
      );
      resolve(true);
    } catch (e) {
      reject(`An error occured when rendering in canvas`);
      throw new Error(`Canvas Rendering Error: ${e}`);
    }
  });
};

export default Renderer;
