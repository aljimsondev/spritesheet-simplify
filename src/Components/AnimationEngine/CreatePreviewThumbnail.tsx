import React from "react";
import { BufferDatasetProperties } from "../card/types";
import { calculateAspectRatioFit } from "./CalculateImageRatio";

function CreatePreviewThumbnail(
  image: HTMLImageElement,
  spriteProps: BufferDatasetProperties,
  context: CanvasRenderingContext2D,
  frameWidth: number,
  frameHeight: number
) {
  if (!image || image?.src === "data:,") return; //broken state
  //clear rect first

  const { height, width } = calculateAspectRatioFit(
    spriteProps.width,
    spriteProps.height,
    frameWidth,
    frameHeight
  );

  context?.clearRect(0, 0, frameWidth, frameHeight);

  context?.drawImage(
    image, //image
    0 * spriteProps.width, //image source x
    0 * spriteProps.height, //image source y
    spriteProps.width, //image sprite width
    spriteProps.height, //image sprite height
    0, //position x
    0, // position y
    width, // sprite size width
    height //sprite size  height
  );
}

export default CreatePreviewThumbnail;
