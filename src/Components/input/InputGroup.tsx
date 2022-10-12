import React from "react";

const InputGroup = React.forwardRef<
  HTMLInputElement,
  {
    width?: number;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    id?: string;
    label: string;
    value?: string;
  }
>(({ width = 50, onChange, id, label, value }, ref) => {
  return (
    <label htmlFor={id} className="input-group-base">
      <p ref={ref}>{label}</p>
      <input
        onChange={onChange}
        id={id}
        style={{ maxWidth: width }}
        className="input-group-input"
        value={value}
      />
    </label>
  );
});

export default InputGroup;
