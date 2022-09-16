export type ButtonType = {
  children: JSX.Element | string;
  className?: string;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  variant?: "primary" | "secondary" | "default";
  onClick: React.DOMAttributes<HTMLButtonElement>["onClick"];
};

export type FabProps = {
  onClick: () => void;
  text?: string;
  icon?: JSX.Element;
};
