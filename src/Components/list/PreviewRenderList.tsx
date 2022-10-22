import React from "react";
import PreviewCard from "../card/PreviewCard";
import { RenderListProps } from "./types";

const RenderList: React.FC<RenderListProps> = ({
  sprites,
  backgroundColor,
  displayBackgroundColor,
  updateSpritesheetColumn,
  handleRemoveColumn,
}) => {
  return (
    <React.Fragment>
      {sprites.map((spritesheet, index) => {
        const props: {
          name: string;
          height: number;
          width: number;
          posY: number;
          arrayIndex: number;
        } = JSON.parse(spritesheet.dataset?.props!);
        return (
          <PreviewCard
            key={`${spritesheet.dataset.props! + index}`}
            backgroundColor={backgroundColor}
            displayBackgroundColor={displayBackgroundColor}
            buffer={spritesheet}
            updateSpritesheetColumn={updateSpritesheetColumn}
            handleRemoveColumn={handleRemoveColumn}
            height={props.height}
            width={props.width}
            y={props.posY}
            name={props.name}
            sourceIndex={props.arrayIndex}
          />
        );
      })}
    </React.Fragment>
  );
};

export default React.memo(RenderList);
