import React from "react";
import { NavbarProps, NODE } from "../types";
import {
  AiFillSetting,
  AiOutlineDownload,
  AiOutlinePlus,
  AiOutlineClose,
  AiFillCaretDown,
  AiFillFolder,
} from "react-icons/ai";
import { FaBars } from "react-icons/fa";
import { BiImageAdd } from "react-icons/bi";
import NavbarButton from "../button/NavbarButton";
import DropdownMenu from "../dropdown/DropdownMenu";
import NavMenuForm from "../form/NavMenuForm";
import Logo from "../logo/Logo";
import { Context } from "../../Store/store";
import InlineGroup from "../group/InlineGroup";
import Switch from "../switch/Switch";

const Navbar: React.FC<NavbarProps> = ({
  clearSelection,
  download,
  handleOpenFileInput,
}) => {
  const dropdownRef = React.useRef(null);
  const [open, setOpen] = React.useState<boolean>(false);
  const { toogleMenu, openMenu, handleReload } = React.useContext(Context);
  const [dark, setDarkMode] = React.useState(false);
  const navData = [
    {
      icon: <BiImageAdd size={30} />,
      onClick: handleOpenFileInput,
      tooltip: true,
      tooltipLabel: "Add Sprites",
    },
  ];
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
          <div className="text-white">
            <p>Guest</p>
          </div>
          <div ref={dropdownRef}>
            <DropdownMenu
              buttonClass="m-1 h-[6vh] text-white"
              open={open}
              position="left"
              toggleState={setOpen}
              dropdownRef={dropdownRef}
              icon={<AiFillCaretDown />}
            >
              <>
                <div className="nav-options-form-base">
                  <form className="nav-options-form">
                    <InlineGroup className="items-center mt-2">
                      <>
                        <div className="flex-1">
                          <button className="nav-options-btn">
                            Reload App
                          </button>
                        </div>
                        <p className="nav-options-btn-label">Ctrl + R</p>
                      </>
                    </InlineGroup>
                    <InlineGroup className="items-center mt-2">
                      <>
                        <div className="flex-1">
                          <button className="nav-options-btn">
                            Clear Canvas
                          </button>
                        </div>
                        <p className="nav-options-btn-label">Ctrl + X</p>
                      </>
                    </InlineGroup>
                    <InlineGroup className="items-center mt-2">
                      <>
                        <div className="flex-1">
                          <p className="text-white text-sm">Zoom in</p>
                        </div>
                        <p className="nav-options-btn-label">
                          Ctrl + MouseWheelUp
                        </p>
                      </>
                    </InlineGroup>
                    <InlineGroup className="items-center mt-2">
                      <>
                        <div className="flex-1">
                          <p className="text-white text-sm">Zoom out</p>
                        </div>
                        <p className="nav-options-btn-label">
                          Ctrl + MouseWheelDown
                        </p>
                      </>
                    </InlineGroup>
                    <InlineGroup className="items-center mt-2">
                      <>
                        <div className="flex-1">
                          <p className="text-white text-sm">Drag Canvas</p>
                        </div>
                        <p className="nav-options-btn-label">
                          Shift + Mousemove
                        </p>
                      </>
                    </InlineGroup>
                    <InlineGroup className="items-center mt-2">
                      <>
                        <div className="flex-1">
                          <p className="text-white text-sm">
                            Reset Canvas Scale
                          </p>
                        </div>
                        <p className="nav-options-btn-label">Doubleclick</p>
                      </>
                    </InlineGroup>
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
          {navData.map((data, index) => {
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
          {/* <button onClick={handleReload} className="reload-btn">
            Reload
          </button>
          <button onClick={clearSelection} className="clear-btn">
            Clear
          </button> */}
          <NavbarButton
            icon={
              openMenu ? <AiOutlineClose size={20} /> : <FaBars size={20} />
            }
            onClick={toogleMenu}
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
