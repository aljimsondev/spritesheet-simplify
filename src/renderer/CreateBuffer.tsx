const createSpriteSheet = (images: HTMLImageElement[]) => {
  const canvas = document.createElement("canvas");
  canvas.height = images[0].height;
  canvas.width = images[0].width * images.length || 0;
  const ctx = canvas.getContext("2d")!;
  const image = new Image();

  for (let col = 0; col < images.length; col++) {
    let img = images[col];
    ctx.drawImage(
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
  const datasetProps = {
    height: images[0].height,
    width: images[0].width,
    name: images[0].alt,
  };

  image.src = canvas.toDataURL();
  image.dataset.props = JSON.stringify(datasetProps);
  return image;
};

export const CreateBuffer = (images: HTMLImageElement[][]) => {
  return images.map((col) => {
    return createSpriteSheet(col);
  });
};
