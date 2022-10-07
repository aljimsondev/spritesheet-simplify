import { NotificationProps } from "../Components/notification/type";
import {
  ComponentReducerActionType,
  NotificationReducerActions,
} from "./reducers/types";

export type StoreProps = {
  children: JSX.Element;
};

export type AppProperties = {
  width: number;
  height: number;
  padding: number;
  fileName: string;
  borderLine: boolean;
};

export type ContextType = {
  setProperties: React.Dispatch<React.SetStateAction<AppProperties>>;
  properties: AppProperties;
  notification: NotificationProps;
  notificationDispatch: React.Dispatch<
    ComponentReducerActionType<NotificationReducerActions, NotificationProps>
  >;
  setBuffers: React.Dispatch<React.SetStateAction<HTMLImageElement[]>>;
  buffers: HTMLImageElement[];
  openMenu: boolean;
  toogleMenu: () => void;
  sidebarRef: React.RefObject<HTMLDivElement>;
  reloadApp: boolean;
  handleReload: () => void;
};
