import React from "react";

type TabProps = {
  children: JSX.Element;
  className?: string;
  isActive?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  tabIndex?: number;
  tabLabel: string;
  ariaSelected?: boolean;
};

type TabType = (props: TabProps) => JSX.Element;

export const Tab: TabType = (props) => {
  const { onClick, isActive, tabIndex, tabLabel, ariaSelected } = props;

  return (
    <button
      aria-selected={ariaSelected}
      onClick={onClick}
      tabIndex={tabIndex}
      className={isActive ? "sidebar-btn-active" : ""}
    >
      {tabLabel}
    </button>
  );
};

export default React.memo(Tab);
