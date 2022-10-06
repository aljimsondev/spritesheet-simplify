import React, { ReactNode } from "react";
import { Portal } from "../Portal";
import { NODE } from "../types";
import "./Notification.css";
import {
  AiOutlineExclamation,
  AiOutlineQuestion,
  AiOutlineCheck,
} from "react-icons/ai";
import { FaTimes } from "react-icons/fa";
import { NotificationProps } from "./type";

const Notification: NODE<NotificationProps> = (props) => {
  const [Icon, setIcon] = React.useState<ReactNode | null>(null);
  const spanRef = React.useRef<HTMLSpanElement>(null);
  const duration = 5000;

  //set icon
  const setIconStatus = React.useCallback(() => {
    switch (props.type) {
      case "error":
        return setIcon(<AiOutlineExclamation />);
      case "success":
        return setIcon(<AiOutlineCheck />);
      case "warning":
        return setIcon(<AiOutlineQuestion />);
      default:
        return null;
    }
  }, [props.type]);

  const timeOut = () => {
    return setTimeout(() => {
      if (props.onClose) {
        props.onClose();
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
  }, [props]);

  return (
    <React.Fragment>
      {props.open && (
        <Portal>
          <div className="notification-base">
            <div className="notification">
              {Icon && (
                <span
                  ref={spanRef}
                  className={`notification-icon --${props.type}`}
                >
                  {Icon}
                </span>
              )}
              <p>{props.text}</p>
              {props.dismissable && (
                <button
                  className="close-button default -xs centered"
                  onClick={props.onClose}
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>
        </Portal>
      )}
    </React.Fragment>
  );
};

export default React.memo(Notification);
