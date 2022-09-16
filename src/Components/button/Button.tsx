import React from "react";
import { NODE } from "../types";
import { ButtonType } from "./types";

const Button: NODE<ButtonType> = ({ children, className, type, onClick }) => {
  return (
    <button
      type={type ? type : "button"}
      className={className}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default React.memo(Button);
