import React from "react";
import { SwitchProps } from "./type";

const Switch: React.FC<SwitchProps> = ({
  onSwitch,
  checked,
  name,
  inActiveIcon,
  activeIcon,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (checked) {
      ref.current?.classList.add("switch-active");
    } else {
      ref.current?.classList.remove("switch-active");
    }
  }, [checked]);

  return (
    <div className="switch-base" ref={ref}>
      <span>{checked ? activeIcon : inActiveIcon}</span>
      <div className="switch">
        <input
          onChange={onSwitch}
          name={name}
          checked={checked}
          type="checkbox"
          className="switch-input"
        />
      </div>
    </div>
  );
};

export default Switch;
