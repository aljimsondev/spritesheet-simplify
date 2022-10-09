import React from "react";
import { NotificationProps } from "../Components/notification/type";
import { BufferData, Child } from "../Components/types";
import { NotificationReducer } from "./reducers/NotificationReducers";
import { NotificationReducerType } from "./reducers/types";
import { AppProperties, ContextType, StoreProps } from "./types";

export const defaultStatus = {
  width: 0,
  height: 0,
  padding: 20,
  fileName: "spritesheet",
  borderLine: false,
};

export const defaultNotification: NotificationProps = {
  onClose: () => {},
  open: false,
  type: "success",
  dismissable: false,
  text: "",
};

export const Context = React.createContext<ContextType>({
  properties: defaultStatus,
  setProperties: () => {},
  notification: defaultNotification,
  notificationDispatch: () => {},
  buffers: [],
  setBuffers: () => {},
  openMenu: true,
  toogleMenu: () => {},
  sidebarRef: { current: null },
  reloadApp: false,
  handleReload: () => {},
});

const Store: Child<StoreProps> = ({ children }) => {
  const [notification, notificationDispatch] = React.useReducer<
    NotificationReducerType,
    NotificationProps
  >(NotificationReducer, defaultNotification, () => {
    return defaultNotification;
  });

  const [properties, setProperties] =
    React.useState<AppProperties>(defaultStatus);
  const [buffers, setBuffers] = React.useState<BufferData[][]>([]);
  const [open, setMenuStatus] = React.useState<boolean>(true);
  const sidebarRef = React.useRef<HTMLDivElement>(null);
  const [reloadApp, setReloadApp] = React.useState(false);

  const toogleMenu = React.useCallback(() => {
    setMenuStatus((prevMenuState) => !prevMenuState);
    if (sidebarRef.current) {
      sidebarRef.current.classList.toggle("--close");
    }
  }, [sidebarRef.current]);

  const handleReload = () => {
    setReloadApp(true);
  };

  React.useEffect(() => {
    return () => {
      setReloadApp(false);
    };
  }, [reloadApp]);

  return (
    <Context.Provider
      value={{
        properties: properties,
        setProperties: setProperties,
        notification,
        notificationDispatch,
        buffers: buffers,
        setBuffers: setBuffers,
        openMenu: open,
        toogleMenu: toogleMenu,
        sidebarRef: sidebarRef,
        reloadApp: reloadApp,
        handleReload: handleReload,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Store;
