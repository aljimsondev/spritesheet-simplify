/**
 * this is the  type defination of Context API Reducers
 */

import { Reducer } from "react";
import { NotificationProps } from "../../Components/notification/type";

export type ComponentReducerActionType<T, P> = {
  type: T;
  payload?: P;
};

export type NotificationReducerActions =
  | "ADD_NOTIFICATION"
  | "RESET_NOTIFICATION";

export type NotificationReducerType = Reducer<
  NotificationProps,
  ComponentReducerActionType<NotificationReducerActions, NotificationProps>
>;
