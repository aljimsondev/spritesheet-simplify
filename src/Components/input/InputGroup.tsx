import React from "react";

const InputGroup: React.FC<{ width: number }> = ({}) => {
  return (
    <label htmlFor="h-input" className="input-group-base">
      <p ref={frameXTextRef}>H</p>
      <input id="h-input" className="input-group-input" />
    </label>
  );
};

export default InputGroup;
