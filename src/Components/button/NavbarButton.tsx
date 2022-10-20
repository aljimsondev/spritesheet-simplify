import React from "react";
import ToolTip from "../tooltip";
import { NavbarButtonProps, NODE } from "../../types/types";

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
    <ToolTip label={tooltipLabel} enabled={tooltip}>
      <button
        aria-label="nav-button"
        className="nav-button centered"
        type={type || "button"}
        onClick={onClick}
        ref={ref}
      >
        {icon}
      </button>
    </ToolTip>
  );
};

export default React.memo(NavbarButton);
