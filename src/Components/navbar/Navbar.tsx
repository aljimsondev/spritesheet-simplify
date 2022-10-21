import React from "react";

const Navbar: React.FC<{ children: JSX.Element[] }> = ({ children }) => {
  return <div className="navbar">{children}</div>;
};

export default Navbar;
