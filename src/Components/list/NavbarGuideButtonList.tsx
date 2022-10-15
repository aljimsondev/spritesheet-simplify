import React from "react";
import InlineGroup from "../group/InlineGroup";

const NavbarGuideButtonList: React.FC<{
  data: {
    onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    label: string;
    shortcutKey: string;
  }[];
}> = ({ data }) => {
  return (
    <React.Fragment>
      {data.map((btn, index) => {
        return (
          <InlineGroup
            className="items-center mt-2"
            key={`${btn.shortcutKey + index}`}
          >
            <div className="flex-1">
              <button
                type="button"
                className="nav-options-btn"
                onClick={btn.onClick}
              >
                {btn.label}
              </button>
            </div>
            <p className="nav-options-btn-label">{btn.shortcutKey}</p>
          </InlineGroup>
        );
      })}
    </React.Fragment>
  );
};

export default NavbarGuideButtonList;
