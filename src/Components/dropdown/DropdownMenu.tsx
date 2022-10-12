import React from "react";
import { DropDownProps, NODE } from "../types";
import ClickAwayListener from "../listener/ClickAwayEventListener";

const DropdownMenu: React.FC<DropDownProps> = ({
  children,
  icon,
  open,
  dropdownRef,
  toggleState,
  buttonClass = "",
}) => {
  React.useEffect(() => {
    const listener = new ClickAwayListener(dropdownRef, () => {
      toggleState(false);
    });

    return () => {
      listener.remove();
    };
  }, []);

  const toggle = () => {
    toggleState((prevState) => !prevState);
  };
  return (
    <div ref={dropdownRef} className="nav-menu-base">
      <button className={buttonClass} onClick={toggle}>
        {icon}
      </button>
      <div className={open ? `nav-menu --active` : `nav-menu`}>
        <div className="nav-menu-content">{children}</div>
      </div>
    </div>
  );
};

export default React.memo(DropdownMenu);
