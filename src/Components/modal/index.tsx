import React from "react";
import { Portal } from "../Portal";
import { NODE } from "../types";
import { ModalProps } from "./types";

const Modal: NODE<ModalProps> = ({ children, open }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (open) {
      ref.current?.classList.toggle("--open");
    }
    return () => {
      ref.current?.classList.remove("--open");
    };
  }, [open]);

  return (
    <React.Fragment>
      {open ? (
        <Portal>
          <div ref={ref} className="modal">
            <div className="modal-content">
              <div className="modal-container">{children}</div>
            </div>
          </div>
        </Portal>
      ) : (
        <></>
      )}
    </React.Fragment>
  );
};

export default Modal;
