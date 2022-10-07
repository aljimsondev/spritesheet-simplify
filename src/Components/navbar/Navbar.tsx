import React from "react";
import { NavbarProps, NODE } from "../types";
import "./navbar.css";
import {
  AiFillSetting,
  AiOutlineDownload,
  AiOutlinePlus,
  AiOutlineClose,
  AiOutlineReload,
} from "react-icons/ai";
import { FaBars } from "react-icons/fa";
import NavbarButton from "../button/NavbarButton";
import DropdownMenu from "../dropdown/DropdownMenu";
import NavMenuForm from "../form/NavMenuForm";
import Logo from "../logo/Logo";
import { Context } from "../../Store/store";

const Navbar: NODE<NavbarProps> = ({
  clearSelection,
  download,
  handleOpenFileInput,
}) => {
  const dropdownRef = React.useRef(null);
  const [open, setOpen] = React.useState<boolean>(false);
  const { toogleMenu, openMenu, handleReload } = React.useContext(Context);

  const navData = [
    {
      icon: <AiOutlineReload size={25} color="#fa614d" />,
      onClick: handleReload,
      tooltip: true,
      tooltipLabel: "Reload",
    },
    {
      icon: <AiOutlinePlus size={25} color="#fa614d" />,
      onClick: clearSelection,
      classList: "rotated-45deg",
      tooltip: true,
      tooltipLabel: "Clear Canvas",
    },
    {
      icon: <AiOutlinePlus size={25} color="#0ea816" />,
      onClick: handleOpenFileInput,
      tooltip: true,
      tooltipLabel: "Add Sprites",
    },
    {
      icon: <AiOutlineDownload size={25} color="#4c0ab6" />,
      onClick: download,
      tooltip: true,
      tooltipLabel: "Download Spritesheet",
    },
  ];

  return (
    <div className="navbar">
      <div className="nav-title">
        <Logo />
      </div>
      <div className="flex-grow flex-row">
        <div className="nav-button-base">
          {navData.map((data, index) => {
            return (
              <NavbarButton
                icon={data.icon}
                onClick={data.onClick}
                key={index + data.tooltipLabel}
                tooltip={data.tooltip}
                tooltipLabel={data.tooltipLabel}
                classList={data.classList}
              />
            );
          })}
          <DropdownMenu
            dropdownRef={dropdownRef}
            open={open}
            toggleState={setOpen}
            icon={<AiFillSetting size={20} />}
          >
            <NavMenuForm />
          </DropdownMenu>
          <NavbarButton
            icon={
              openMenu ? <AiOutlineClose size={25} /> : <FaBars size={25} />
            }
            onClick={toogleMenu}
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
