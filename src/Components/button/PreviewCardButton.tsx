import React from "react";

// const PreviewCardButton: React.FC<{
//   onClick: React.MouseEventHandler<HTMLButtonElement>;
//   children: JSX.Element[];
//   className?: string;
// }> = ({ onClick, children }) => {
//   return (
//     <div className="flex-1">
//       <button className="-icon-button" onClick={onClick}>
//         {children}
//       </button>
//     </div>
//   );
// };

type PreviewCardButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  children: any;
  className?: string;
};

const PreviewCardButton = React.forwardRef<
  HTMLButtonElement,
  PreviewCardButtonProps
>(({ onClick, children, className }, ref) => {
  return React.createElement(
    "div",
    {
      className: "flex-1",
    },
    React.createElement(
      "button",
      {
        className: "-icon-button " + className,
        onClick: onClick,
        ref: ref,
      },
      children
    )
  );
});

export default PreviewCardButton;
