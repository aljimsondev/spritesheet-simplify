import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import React from "react";

const Accordion: React.FC<{
  hidden?: boolean;
  isOpen?: boolean;
  activeIcon?: JSX.Element;
  label?: string;
  title: string;
  inactiveIcon?: JSX.Element;
  children: JSX.Element[] | JSX.Element;
}> = ({
  activeIcon = <AiOutlinePlus size={20} />,
  inactiveIcon = <AiOutlineMinus size={20} />,
  isOpen = false,
  hidden = true,
  label,
  title,
  children,
}) => {
  const [open, setOpen] = React.useState(isOpen);

  const toogle = React.useCallback(() => {
    setOpen((prevState) => !prevState);
  }, [open]);

  return (
    <div className="configuration-base outline-b">
      <div className="flex-1 flex items-center justify-between">
        <p className="text-title">{title}</p>
        <button onClick={toogle} className="-icon-button">
          {open ? inactiveIcon : activeIcon}
        </button>
      </div>
      <details open={open}>
        <summary className={hidden ? "hidden" : label}></summary>
        {open && children}
      </details>
    </div>
  );
};

export default Accordion;
