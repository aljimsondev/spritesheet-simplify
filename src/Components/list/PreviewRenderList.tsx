import React from "react";
import PreviewCard from "../card/PreviewCard";

const RenderList: React.FC<{
  sprites: HTMLImageElement[];
  backgroundColor: string;
  displayBackgroundColor: boolean;
}> = ({ sprites, backgroundColor, displayBackgroundColor }) => {
  return (
    <React.Fragment>
      {sprites.map((spritesheet, index) => {
        return (
          <PreviewCard
            key={`${spritesheet.dataset.props! + index}`}
            backgroundColor={backgroundColor}
            displayBackgroundColor={displayBackgroundColor}
            buffer={spritesheet}
          />
        );
      })}
    </React.Fragment>
  );
};

export default React.memo(RenderList);
