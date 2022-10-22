export type LocalStates = {
  loading: boolean;
  spritesheets: HTMLImageElement[];
};

export type UpdateSpritesheetColumn = (
  index: number,
  width: number,
  height: number
) => void;
