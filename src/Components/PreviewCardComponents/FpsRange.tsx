import React from "react";
import InlineGroup from "../group/InlineGroup";
import InputGroup from "../input/InputGroup";
import InputRange from "../input/InputRange";

const FpsRange: React.FC<{
  fps: number;
  handleChangeFPS: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ fps, handleChangeFPS }) => {
  return (
    <div className="preview-controller-label">
      <InlineGroup className="justify-between mt-2">
        <InputGroup
          label="FPS"
          inputProps={{
            value: fps,
            onChange: () => {},
          }}
        />
      </InlineGroup>
      <InputRange value={fps} onChange={handleChangeFPS} />
    </div>
  );
};

export default React.memo(FpsRange);
