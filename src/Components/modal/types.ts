export type ModalProps = {
  children: JSX.Element;
  open: boolean;
  toogleState?: () => void;
};

export type LinkData = {
  icon: JSX.Element;
  link: string;
  type: "link" | "text";
};

export type OnSelectLink = (
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  data: LinkData
) => void;

export type ModalFooterButtonProps = { data: LinkData };
