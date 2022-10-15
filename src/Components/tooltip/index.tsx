import React from "react";

const ToolTip = React.forwardRef<
  HTMLDivElement,
  {
    children: JSX.Element[] | JSX.Element;
    label?: string;
    innerProps?: React.HTMLAttributes<HTMLDivElement>;
    enabled?: boolean;
  }
>(({ children, label = "", innerProps, enabled = false }, ref) => {
  return React.createElement(
    "div",
    {
      ...innerProps,
      ref: ref,
      "data-tooltip": label,
      className: enabled ? "tooltip" : "",
    },
    children
  );
});

export default ToolTip;
