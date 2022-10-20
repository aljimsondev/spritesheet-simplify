import React from "react";
import { UpdateSpritesheetColumn } from "./main";
export type NODE<T> = (props: T) => JSX.Element;
export type NavbarProps = {
  handleSelectImages: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearSelection: () => void;
  downloadButtonRef: React.RefObject<HTMLAnchorElement>;
  handleOpenFileInput: () => void;
};

export type NavMenuInputProps = {};

export type DropDownProps = {
  children: JSX.Element;
  icon: JSX.Element;
  dropdownRef: React.RefObject<HTMLDivElement>;
  open: boolean;
  toggleState: React.Dispatch<React.SetStateAction<boolean>>;
  buttonClass?: string;
  position?: "left" | "right";
  background?: string;
};
export type NavbarButtonProps = {
  icon: JSX.Element;
  tooltip?: boolean;
  tooltipLabel?: string;
  classList?: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
};

export type Child<T> = (props: T) => JSX.Element;

export type ClickAwayEventListener<T = any> = (
  ref: React.RefObject<T>,
  cb: () => void
) => void;

export type FormInputProps = {
  classList?: string;
  label?: string;
  value: React.InputHTMLAttributes<HTMLInputElement>["value"];
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
  name?: string;
  placeholder?: string;
  onValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export type BufferData = {
  data: string | ArrayBuffer | null;
  name: File["name"];
};
export type ExportSpritesheetType = (fileName: string) => Promise<void>;

export type SidebarProps = {
  exportSpritesheet: ExportSpritesheetType;
  spritesheets: HTMLImageElement[];
  updateSpritesheetColumn: UpdateSpritesheetColumn;
};
