import React from "react";
import { NotificationProps } from "../Components/notification/type";
import { Child } from "../Components/types";
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

  return (
    <Context.Provider
      value={{
        properties: properties,
        setProperties: setProperties,
        notification,
        notificationDispatch,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Store;
