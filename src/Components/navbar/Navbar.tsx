import React from "react";
import { NavbarProps } from "../types";
import { AiFillCaretDown } from "react-icons/ai";
import { BiImageAdd } from "react-icons/bi";
import NavbarButton from "../button/NavbarButton";
import DropdownMenu from "../dropdown/DropdownMenu";
import Logo from "../logo/Logo";
import { Context } from "../../Store/store";
import InlineGroup from "../group/InlineGroup";
import Switch from "../switch/Switch";
import NavbarControlGuideList from "../list/NavbarControlGuideList";
import NavbarGuideButtonList from "../list/NavbarGuideButtonList";
import AnimatedMenuIcon from "../button/AnimatedIcon";

const Navbar: React.FC<NavbarProps> = ({
  clearSelection,
  handleOpenFileInput,
}) => {
  const dropdownRef = React.useRef(null);
  const [open, setOpen] = React.useState<boolean>(false);
  const { toogleMenu, openMenu, handleReload } = React.useContext(Context);
  const [dark, setDarkMode] = React.useState(false);

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
    appController: [
      {
        icon: <BiImageAdd size={30} />,
        onClick: handleOpenFileInput,
        tooltip: true,
        tooltipLabel: "Add Sprites",
      },
    ],
  };

  const toogleTheme = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <div className="navbar">
      <div className="nav-title">
        <Logo />
      </div>
      <div className="nav-flex-grow">
        <div className="flex h-[7vh] items-center justify-end relative ml-3">
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
              <>
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
                          />
                        </div>
                        <p className="nav-options-btn-label">Toogle Theme</p>
                      </>
                    </InlineGroup>
                  </form>
                </div>
              </>
            </DropdownMenu>
          </div>
          {navbarData.appController.map((data, index) => {
            return (
              <NavbarButton
                icon={data.icon}
                onClick={data.onClick}
                key={index + data.tooltipLabel}
                tooltip={data.tooltip}
                tooltipLabel={data.tooltipLabel}
              />
            );
          })}
        </div>
        <div className="nav-button-base">
          <NavbarButton
            icon={<AnimatedMenuIcon active={!openMenu} />}
            onClick={toogleMenu}
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
