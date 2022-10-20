import React from "react";

const InputRange: React.FC<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
> = ({ value = 1, min = 1, max = 100, onChange }) => {
  return (
    <input type="range" value={value} min={min} max={max} onChange={onChange} />
  );
};

export default React.memo(InputRange);
