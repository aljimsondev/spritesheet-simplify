import React, { ReactNode } from "react";
import { Portal } from "../Portal";
import { NODE } from "../types";
import "./Notification.css";
import {
  AiOutlineExclamation,
  AiOutlineQuestion,
  AiOutlineCheck,
} from "react-icons/ai";
import { NotificationProps } from "./type";

const Notification: NODE<NotificationProps> = ({
  type,
  open,
  onClose,
  dismissable,
  text,
}) => {
  const [Icon, setIcon] = React.useState<ReactNode | null>(null);
  const spanRef = React.useRef<HTMLSpanElement>(null);
  const duration = 5000;
  const [spanClass, setSpanClass] = React.useState("");

  //TODO refactor code and add auto close snackbar
  //TODO notification wouldnt stack if called consecutively
  //set icon
  const setIconStatus = React.useCallback(() => {
    switch (type) {
      case "error":
        setSpanClass("--error");
        return setIcon(<AiOutlineExclamation />);
      case "success":
        setSpanClass("--success");
        return setIcon(<AiOutlineCheck />);
      case "warning":
        setSpanClass("--warning");
        return setIcon(<AiOutlineQuestion />);
      default:
        return null;
    }
  }, [type]);

  const timeOut = () => {
    return setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, duration);
  };

  React.useEffect(() => {
    setIconStatus();
    const timer = timeOut();
    return () => {
      //clean up
      setIcon(null);
      clearInterval(timer);
    };
  }, [open]);

  return (
    <React.Fragment>
      {open && (
        <Portal>
          <div className="notification-base">
            <div className="notification">
              {dismissable && (
                <button
                  className="notification-close-btn centered"
                  onClick={onClose}
                >
                  &times;
                </button>
              )}
              {Icon && (
                <span
                  ref={spanRef}
                  className={`notification-icon ${spanClass}`}
                >
                  {Icon}
                </span>
              )}
              <p>{text}</p>
            </div>
          </div>
        </Portal>
      )}
    </React.Fragment>
  );
};

export default Notification;
