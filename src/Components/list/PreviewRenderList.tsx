import React from "react";
import PreviewCard from "../card/PreviewCard";
import { RenderListProps } from "./types";

const RenderList: React.FC<RenderListProps> = ({
  sprites,
  backgroundColor,
  displayBackgroundColor,
  updateSpritesheetColumn,
}) => {
  return (
    <React.Fragment>
      {sprites.map((spritesheet, index) => {
        return (
          <PreviewCard
            key={`${spritesheet.dataset.props! + index}`}
            backgroundColor={backgroundColor}
            displayBackgroundColor={displayBackgroundColor}
            buffer={spritesheet}
            updateSpritesheetColumn={updateSpritesheetColumn}
          />
        );
      })}
    </React.Fragment>
  );
};

export default React.memo(RenderList);
