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
  const uniq_id = React.useId();
  return (
    <label htmlFor={uniq_id} className="input-group-base">
      <p className="input-group-label">{label}</p>
      <input
        ref={ref}
        {...inputProps}
        id={uniq_id}
        style={{ maxWidth: width }}
        className="input-group-input --o-n-input"
      />
    </label>
  );
});

export default React.memo(InputGroup);
