import React from "react";

type TabProps = {
  children: JSX.Element;
  className?: string;
  isActive?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  tabIndex?: number;
  tabLabel: string;
};

type TabType = (props: TabProps) => JSX.Element;

export const Tab: TabType = ({ onClick, isActive, tabIndex, tabLabel }) => {
  return (
    <button
      onClick={onClick}
      tabIndex={tabIndex}
      className={isActive ? "sidebar-btn-active" : ""}
    >
      {tabLabel}
    </button>
  );
};

export default React.memo(Tab);
