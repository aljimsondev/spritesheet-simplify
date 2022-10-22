import React from "react";
import InlineGroup from "../group/InlineGroup";
import InputGroup from "../input/InputGroup";

const SpritesProperties = React.forwardRef<
  HTMLInputElement,
  {
    x: number;
    y: number;
    height: number;
    width: number;
    onEnterKey: React.KeyboardEventHandler<HTMLInputElement>;
    onChangeValue: React.ChangeEventHandler<HTMLInputElement>;
  }
>(({ height, onChangeValue, onEnterKey, width, x, y }, frameXRenderRef) => {
  return (
    <>
      <InlineGroup className="mt-2">
        <div className="flex-1">
          <InputGroup
            label="H"
            inputProps={{
              value: height,
              onKeyDownCapture: onEnterKey,
              name: "height",
              onChange: onChangeValue,
              type: "number",
            }}
          />
        </div>
        <div className="flex-1">
          <InputGroup
            label="W"
            inputProps={{
              onChange: onChangeValue,
              onKeyDownCapture: onEnterKey,
              value: width,
              name: "width",
              type: "number",
            }}
          />
        </div>
      </InlineGroup>
      <InlineGroup>
        <div className="flex-1">
          <InputGroup
            ref={frameXRenderRef}
            label="X"
            inputProps={{
              onChange: (e) => {},
              value: 0,
            }}
          />
        </div>
        <div className="flex-1">
          <InputGroup
            label="Y"
            inputProps={{
              onChange: (e) => {},
              value: y,
            }}
          />
        </div>
      </InlineGroup>
    </>
  );
});

export default SpritesProperties;
