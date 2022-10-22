import { UpdateSpritesheetColumn } from "../../types/main";

export type SpritePreviewCardProps = {
  sprites: HTMLImageElement[][];
};

export type BufferDatasetProperties = {
  width: number;
  height: number;
  name: string;
};

export type PreviewCardProps = {
  buffer: HTMLImageElement | undefined;
  backgroundColor: string;
  displayBackgroundColor: boolean;
  updateSpritesheetColumn: UpdateSpritesheetColumn;
  height: number;
  width: number;
  y: number;
  name: string;
  sourceIndex: number;
};
