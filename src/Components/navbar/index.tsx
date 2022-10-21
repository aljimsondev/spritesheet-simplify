import React from "react";
import { NavbarProps } from "../../types/types";
import { BiImageAdd } from "react-icons/bi";
import NavbarButton from "../button/NavbarButton";
import Logo from "../logo/Logo";
import { Context } from "../../Store/store";
import AnimatedMenuIcon from "../button/AnimatedIcon";
import Navbar from "./Navbar";
import NavbarDropdown from "../dropdown/NavbarDropdown";

const NavbarMain: React.FC<NavbarProps> = ({
  clearSelection,
  handleOpenFileInput,
}) => {
  const { toogleMenu, openMenu, handleReload, buffers } =
    React.useContext(Context);
  const root = window.document.documentElement;
  const [localState, setLocalState] = React.useState({
    dark: false,
  });

  const memoizedButtonData = React.useMemo(() => {
    return {
      icon: <BiImageAdd size={30} />,
      onClick: handleOpenFileInput,
      tooltip: true,
      tooltipLabel: "Add Sprites",
    };
  }, []);

  const navbarData = {
    appController: [memoizedButtonData],
  };
  const toogleTheme = React.useCallback(() => {
    setLocalState({ ...localState, dark: !localState.dark });
  }, [localState.dark]);

  React.useEffect(() => {
    if (localState.dark) {
      if (root?.classList.contains("light")) {
        root.classList.remove("light");
      }
      root.classList.add("dark");
    } else {
      if (root?.classList.contains("dark")) {
        root.classList.remove("dark");
      }
      root.classList.add("light");
    }
  }, [localState.dark]);

  React.useEffect(() => {
    let pressed = false;
    window.addEventListener("keydown", (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
        switch (e.code) {
          case "KeyR":
            //reload app
            handleReload();
            return;
          case "KeyX":
            if (pressed) return;
            clearSelection(); //clear canvas
            pressed = true;
            return;
          default:
            return;
        }
      }
    });
    window.addEventListener("keyup", (e) => {
      pressed = false;
    });
  }, [buffers]);

  const memoizedIcon = React.useMemo(() => {
    return <AnimatedMenuIcon active={!openMenu} />;
  }, [openMenu]);

  return (
    <Navbar>
      <div className="nav-title hidden xs2:flex">
        <Logo />
      </div>
      <div className="nav-flex-grow px-0">
        <div className="flex h-[7vh] items-center justify-end relative ml-0 xs:ml-3">
          <NavbarDropdown
            clearSelection={clearSelection}
            dark={localState.dark}
            handleReload={handleReload}
            toogleTheme={toogleTheme}
          />
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
          <NavbarButton icon={memoizedIcon} onClick={toogleMenu} />
        </div>
      </div>
    </Navbar>
  );
};

export default NavbarMain;
