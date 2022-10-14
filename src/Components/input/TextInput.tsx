import React from "react";

const TextInput = React.forwardRef<
  HTMLInputElement,
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
>((props, ref) => {
  return (
    <div className="text-input-base">
      <input ref={ref} {...props} className="text-input-m" />
    </div>
  );
});

export default React.memo(TextInput);
