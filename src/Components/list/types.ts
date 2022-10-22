import { UpdateSpritesheetColumn } from "../../types/main";
import { HandleRemoveColumnType } from "../../types/types";

export type RenderListProps = {
  sprites: HTMLImageElement[];
  backgroundColor: string;
  displayBackgroundColor: boolean;
  updateSpritesheetColumn: UpdateSpritesheetColumn;
  handleRemoveColumn: HandleRemoveColumnType;
};
