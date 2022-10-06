import React from "react";
import { BufferDatasetProperties } from "../card/types";
import { calculateAspectRatioFit } from "./CalculateImageRatio";

const CreateAnimation = (
  image: HTMLImageElement,
  spriteProperties: BufferDatasetProperties,
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  frameWidth: number,
  frameHeight: number
) => {
  const { height, width } = calculateAspectRatioFit(
    spriteProperties.width,
    spriteProperties.height,
    frameWidth,
    frameHeight
  );

  context?.drawImage(
    image, //image
    x * spriteProperties.width, //image source x
    y * spriteProperties.height, //image source y
    spriteProperties.width, //image sprite width
    spriteProperties.height, //image sprite height
    x, //position x
    y, // position y
    spriteProperties.width * 0.2, // sprite size width
    spriteProperties.width * 0.2 //sprite size  height
  );
};

export default CreateAnimation;
