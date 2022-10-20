export type LocalStates = {
  loading: boolean;
  spritesheets: HTMLImageElement[];
  update: boolean;
};

export type UpdateSpritesheetColumn = (
  index: number,
  width: number,
  height: number
) => void;
