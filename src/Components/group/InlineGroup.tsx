import React from "react";

const InlineGroup: React.FC<{
  children: JSX.Element;
  className?: string;
}> = ({ children, className = "" }) => {
  return <div className={"inline-group " + className}>{children}</div>;
};

export default InlineGroup;
