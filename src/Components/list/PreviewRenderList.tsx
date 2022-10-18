import React from "react";
import PreviewCard from "../card/PreviewCard";

const RenderList: React.FC<{
  sprites: HTMLImageElement[];
  handlePlay: (
    sprite: HTMLImageElement,
    ref: HTMLCanvasElement,
    options?: {
      fps: number;
    }
  ) => void;
  backgroundColor: string;
  displayBackgroundColor: boolean;
}> = ({ sprites, handlePlay, backgroundColor, displayBackgroundColor }) => {
  return (
    <React.Fragment>
      {sprites.map((spritesheet, index) => {
        return (
          <PreviewCard
            key={`${spritesheet.dataset.props! + index}`}
            backgroundColor={backgroundColor}
            displayBackgroundColor={displayBackgroundColor}
            buffer={spritesheet}
            handlePlayState={handlePlay}
          />
        );
      })}
    </React.Fragment>
  );
};

export default React.memo(RenderList);
