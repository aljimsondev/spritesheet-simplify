import React from "react";
import DropdownMenu from "./DropdownMenu";
import InlineGroup from "../group/InlineGroup";
import Switch from "../switch/Switch";
import NavbarControlGuideList from "../list/NavbarControlGuideList";
import NavbarGuideButtonList from "../list/NavbarGuideButtonList";
import { AiFillCaretDown } from "react-icons/ai";
import { BiSun, BiMoon } from "react-icons/bi";

const NavbarDropdown: React.FC<{
  handleReload: () => void;
  clearSelection: () => void;
  toogleTheme: () => void;
  dark: boolean;
}> = ({ handleReload, clearSelection, toogleTheme, dark }) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const dropdownRef = React.useRef(null);
  const navbarData = {
    buttonData: [
      {
        onClick: handleReload,
        label: "Reload App",
        shortcutKey: "Ctrl + R",
      },
      {
        onClick: clearSelection,
        label: "Clear Canvas",
        shortcutKey: "Ctrl + X",
      },
    ],
  };
  return (
    <div ref={dropdownRef}>
      <DropdownMenu
        buttonClass="m-1 h-[6vh] text-white"
        open={open}
        position="left"
        toggleState={setOpen}
        dropdownRef={dropdownRef}
        icon={
          <div className="flex items-center justify-end">
            <AiFillCaretDown />
            <p>Guest</p>
          </div>
        }
      >
        <div className="nav-options-form-base">
          <form className="nav-options-form">
            <NavbarGuideButtonList data={navbarData.buttonData} />
            <NavbarControlGuideList />
            <InlineGroup className="items-center mt-5 border-t-[1px] border-white py-2">
              <>
                <div className="flex-1 flex items-center">
                  <Switch
                    name="theme"
                    onSwitch={toogleTheme}
                    id="theme"
                    checked={dark}
                    inActiveIcon={<BiMoon />}
                    activeIcon={<BiSun />}
                  />
                </div>
                <p className="nav-options-btn-label">Toogle Theme</p>
              </>
            </InlineGroup>
          </form>
        </div>
      </DropdownMenu>
    </div>
  );
};

export default React.memo(NavbarDropdown);
