import React from "react";

const AnimatedMenuIcon: React.FC<{ active: boolean }> = ({ active }) => {
  const thisRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!active) {
      thisRef.current?.classList.add("--a-active-menu");
      return;
    }
    thisRef.current?.classList.remove("--a-active-menu");
  }, [active]);

  return (
    <div className="-a-menu-icon-base" ref={thisRef}>
      <div className="-a-menu-line" />
      <div className="-a-menu-line" />
      <div className="-a-menu-line" />
      <div className="-a-menu-line" />
    </div>
  );
};

export default AnimatedMenuIcon;
