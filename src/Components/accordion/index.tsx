import React from "react";

const Accordion: React.FC<{
  open: boolean;
  toogle: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  hidden: boolean;
  activeIcon: JSX.Element;
  label?: string;
  title: string;
  inactiveIcon: JSX.Element;
  children: JSX.Element[] | JSX.Element;
}> = ({
  open = false,
  toogle,
  activeIcon,
  inactiveIcon,
  hidden,
  label,
  title,
  children,
}) => {
  return (
    <div className="configuration-base outline-b">
      <div className="flex-1 flex items-center justify-between">
        <p className="text-title">{title}</p>
        <button onClick={toogle} className="-icon-button">
          {open ? inactiveIcon : activeIcon}
        </button>
      </div>
      <details open={open}>
        <summary className={hidden ? "hidden" : label}></summary>
        {children}
      </details>
    </div>
  );
};

export default Accordion;
