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
  //TODO refactor code and add auto close snackbar
  //set icon
  const setIconStatus = React.useCallback(() => {
    switch (type) {
      case "error":
        return setIcon(<AiOutlineExclamation />);
      case "success":
        return setIcon(<AiOutlineCheck />);
      case "warning":
        return setIcon(<AiOutlineQuestion />);
      default:
        return null;
    }
  }, [type]);

  React.useEffect(() => {
    setIconStatus();
    return () => {
      //clean up
      setIcon(null);
    };
  }, []);
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
              {Icon && <span className="notification-icon">{Icon}</span>}
              <p>{text}</p>
            </div>
          </div>
        </Portal>
      )}
    </React.Fragment>
  );
};

export default Notification;
