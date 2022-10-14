type SpriteRenderer = (props: {
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
  images: any[];
  y: number;
  borderLine: boolean;
  borderWidth: number;
}) => void;

export const spriteRenderer: SpriteRenderer = ({
  images,
  width,
  height,
  context,
  y,
  borderLine,
  borderWidth,
}) => {
  for (let column = 0; column < images.length; column++) {
    let img = images[column];
    let startingPositionX = 0;
    if (width) {
      startingPositionX = width;
    } else {
      startingPositionX = img.width;
    }
    context.drawImage(
      img, //image
      0, //image source x
      0, //image source y
      img.width, //image sprite width
      img.height, //image sprite height
      column * startingPositionX, //position x
      y, // position y
      width || img.width,
      height || img.height
    );
    if (borderLine) {
      context.lineWidth = borderWidth;
      context.strokeRect(
        column * startingPositionX,
        y,
        width || img.width,
        height || img.height
      );
    }
  }
};
