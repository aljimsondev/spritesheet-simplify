import { NotificationActions } from "../actions";
import { defaultNotification } from "../store";
import { NotificationReducerType } from "./types";

export const NotificationReducer: NotificationReducerType = (state, action) => {
  switch (action.type) {
    case NotificationActions.ADD:
      return {
        ...state,
        dismissable: action.payload?.dismissable,
        onClose: action.payload?.onClose,
        open: action.payload?.open,
        text: action.payload?.text,
        type: action.payload?.type,
      };
    case NotificationActions.RESET:
      return {
        ...state,
        dismissable: defaultNotification.dismissable,
        onClose: defaultNotification.onClose,
        open: defaultNotification.open,
        text: defaultNotification.text,
        type: defaultNotification.type,
      };
    default:
      return state;
  }
};
