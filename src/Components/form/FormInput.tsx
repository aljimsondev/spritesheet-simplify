import React from "react";
import ClickAwayListener from "../listener/ClickAwayEventListener";
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
  let inputClass = "input";

  const setActiveState = () => {
    if (ref.current?.classList.contains("active")) {
      return;
    } else {
      ref.current?.classList.add("active");
      inputRef.current?.focus();
    }
  };

  const handleClickInput = React.useCallback((e: any) => {
    //toggle classlist
    setActiveState();
  }, []);

  React.useEffect(() => {
    if (value !== undefined) {
      setActiveState();
    }

    const handler = new ClickAwayListener(ref, () => {
      if (ref.current?.classList.contains("active")) {
        //check the value
        if (value !== "") {
          return;
        }
        //remove active state
        ref.current.classList.remove("active");
      }
    });

    if (classList) {
      inputClass += classList;
    }
    if (label) {
      ref.current?.classList.add("with-label");
    } else {
      ref.current?.classList.add("mt-default");
    }

    return () => {
      //clean up
      handler.remove();
    };
  }, [value]);

  return (
    <div
      ref={ref}
      className="form-input centered-left"
      aria-hidden
      aria-label="form-input"
    >
      {label && (
        <label role="textbox" onClick={handleClickInput} className="form-label">
          {label}
        </label>
      )}
      <input
        ref={inputRef}
        name={name}
        className={inputClass}
        onClick={handleClickInput}
        onChange={onValueChange}
        placeholder={placeholder}
        min={0}
        type={type || "text"}
        value={value ? value : ""}
      />
    </div>
  );
};

export default React.memo(FormInput);
