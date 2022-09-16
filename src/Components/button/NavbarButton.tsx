import React from "react";
import { NavbarButtonProps, NODE } from "../types";

const NavbarButton: NODE<NavbarButtonProps> = ({
  icon,
  onClick,
  classList,
  type,
  tooltip,
  tooltipLabel,
}) => {
  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (classList && ref.current) {
      ref.current.classList.add(classList);
    }
    return () => {
      //clean up
    };
  }, []);
  return (
    <div className="button-base">
      <button
        aria-label="nav-button"
        className="nav-button centered"
        type={type || "button"}
        onClick={onClick}
        ref={ref}
      >
        {icon}
      </button>
      {tooltip && (
        <div className="tooltip-base">
          <label>{tooltipLabel}</label>
        </div>
      )}
    </div>
  );
};

export default React.memo(NavbarButton);
