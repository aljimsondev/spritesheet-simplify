import React from "react";

const InputGroup = React.forwardRef<
  HTMLInputElement,
  {
    width?: any;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    id?: string;
    label: string;
    value?: any;
    type?: React.HTMLInputTypeAttribute;
  }
>(({ width = 50, onChange = () => {}, id, label, value, type }, ref) => {
  return (
    <label htmlFor={id} className="input-group-base">
      <p ref={ref}>{label}</p>
      <input
        onChange={onChange}
        type={type}
        id={id}
        style={{ maxWidth: width }}
        className="input-group-input"
        value={value}
      />
    </label>
  );
});

export default InputGroup;
