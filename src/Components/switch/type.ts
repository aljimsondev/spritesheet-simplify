export type SwitchProps = {
  onSwitch?: React.InputHTMLAttributes<HTMLInputElement>["onChange"];
  name?: string;
  id?: string;
  checked: React.InputHTMLAttributes<HTMLInputElement>["checked"];
};
