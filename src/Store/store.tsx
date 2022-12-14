import React from "react";
import { NotificationProps } from "../Components/notification/type";
import { BufferData, Child } from "../types/types";
import { NotificationReducer } from "./reducers/NotificationReducers";
import { NotificationReducerType } from "./reducers/types";
import { AppProperties, ContextType, StoreProps } from "./types";

export const defaultStatus = {
  width: 0,
  height: 0,
  padding: 20,
  fileName: "spritesheet",
  borderLine: false,
  borderWidth: 1,
  borderColor: "#000000",
  canvasBackground: "#F3F3F3",
  displayCanvasBackground: true,
  updated: false,
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
  onChangeBorderline: () => {},
  onUpdateProperties: (key: any, value: any) => {},
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

  const handleReload = React.useCallback(() => {
    setReloadApp(true);
    setTimeout(() => {
      setReloadApp(false);
    }, 3000);
  }, [reloadApp]);

  const onChangeBorderline = React.useCallback(() => {
    setProperties({ ...properties, borderLine: !properties.borderLine });
  }, []);

  // function onUpdateProperties<AppProperties>(
  //   key: keyof AppProperties,
  //   value: any
  // ) {
  //   setProperties({ ...properties, [key]: value });
  // }
  const onUpdateProperties = React.useCallback(
    (key: keyof AppProperties, value: any) => {
      setProperties({ ...properties, [key]: value });
    },
    [properties]
  );

  const memoizedProperties = React.useMemo(() => {
    return properties;
  }, [properties]);

  React.useEffect(() => {
    return () => {
      setReloadApp(false);
    };
  }, [reloadApp]);

  return (
    <Context.Provider
      value={{
        properties: memoizedProperties,
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
        onChangeBorderline,
        onUpdateProperties: onUpdateProperties,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Store;
