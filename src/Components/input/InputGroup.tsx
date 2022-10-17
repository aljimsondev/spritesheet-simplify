import React from "react";

const InputGroup = React.forwardRef<
  HTMLInputElement,
  {
    inputProps: React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >;
    width?: number;
    label: string;
  }
>(({ inputProps, width = 40, label }, ref) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  return (
    <label htmlFor={inputRef.current?.id} className="input-group-base">
      <p className="input-group-label">{label}</p>
      <input
        ref={ref}
        {...inputProps}
        id={inputRef.current?.id}
        style={{ maxWidth: width }}
        className="input-group-input --o-n-input"
      />
    </label>
  );
});

export default React.memo(InputGroup);
