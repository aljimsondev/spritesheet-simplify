import React from "react";
import { FormInputProps, NODE } from "../types";

const FormInput: NODE<FormInputProps> = ({
  label,
  classList,
  placeholder,
  name,
  onValueChange,
  value,
  type,
}) => {
  const ref = React.useRef<HTMLDivElement>(null)!;
  const inputRef = React.useRef<HTMLInputElement>(null)!;

  const setActiveState = () => {
    if (ref.current?.classList.contains("active")) {
      return;
    } else {
      ref.current?.classList.add("active");
    }
  };
  const handleClickInput = React.useCallback(
    (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
      e.preventDefault();
      //toggle classlist
      setActiveState();
    },
    []
  );
  React.useEffect(() => {
    if (value !== undefined) {
      setActiveState();
    }

    if (classList) {
      ref.current?.classList.add(classList);
    }
    if (label) {
      ref.current?.classList.add("with-label");
    } else {
      ref.current?.classList.add("mt-default");
    }
    return () => {};
  }, []);

  return (
    <div ref={ref} className="form-input centered-left">
      {label && <label className="form-label">{label}</label>}
      <input
        name={name}
        ref={inputRef}
        className="input"
        onClick={handleClickInput}
        onChange={onValueChange}
        placeholder={placeholder}
        min={0}
        type={type || "text"}
        value={value}
      />
    </div>
  );
};

export default React.memo(FormInput);
