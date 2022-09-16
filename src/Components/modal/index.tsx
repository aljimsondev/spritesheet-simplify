import React from "react";
import { Portal } from "../Portal";
import { NODE } from "../types";
import { ModalProps } from "./types";

const Modal: NODE<ModalProps> = ({ children, open, toogleState }) => {
  return <Portal></Portal>;
};
