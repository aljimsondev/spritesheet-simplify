import React from "react";

const ToolTip = React.forwardRef<
  HTMLDivElement,
  {
    children: JSX.Element[] | JSX.Element;
    label?: string;
    innerProps?: React.HTMLAttributes<HTMLDivElement>;
  }
>(({ children, label, innerProps }, ref) => {
  return React.createElement(
    "div",
    {
      ...innerProps,
      ref: ref,
      "data-tooltip": label,
      className: "tooltip",
    },
    children
  );
});

export default ToolTip;
