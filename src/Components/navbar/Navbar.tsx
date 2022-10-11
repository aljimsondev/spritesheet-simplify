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
      icon: <AiOutlinePlus size={30} />,
      onClick: handleOpenFileInput,
      tooltip: true,
      tooltipLabel: "Add Sprites",
    },
    {
      icon: <AiOutlineDownload size={30} />,
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
      <div className="nav-flex-grow">
        <div className="nav-left-section">
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
          <button onClick={handleReload} className="reload-btn">
            Reload
          </button>
          <button onClick={clearSelection} className="clear-btn">
            Clear
          </button>
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
