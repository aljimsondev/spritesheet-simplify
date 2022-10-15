import React from "react";

const ColorPickerInput: React.FC<{
  onColorChange: (e: any) => void;
  colorValue: string;
  inputProps?: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
}> = ({ colorValue, onColorChange, inputProps }) => {
  const myRef = React.useRef<HTMLInputElement>(null);
  return (
    <label htmlFor={myRef.current?.id} className="-color-picker-wrapper">
      <input
        {...inputProps}
        type="color"
        onChange={onColorChange}
        ref={myRef}
        value={colorValue}
        className="-color-picker-input"
      />
      <p className="-picker-text-color-label">{colorValue}</p>
    </label>
  );
};

export default React.memo(ColorPickerInput);
