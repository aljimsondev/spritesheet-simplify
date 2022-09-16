export type NotificationProps = {
  /**
   * Status of the Notification
   */
  open?: boolean;
  /**
   * Type of the Notification Icon to be displayed
   */
  type?: "success" | "warning" | "error";
  /**
   * Function that holds the close functionality of the Notification
   */
  onClose?: () => void;
  /**
   * Render a close button for closing the Notification
   */
  dismissable?: boolean;
  /**
   * Text to be displayed in the Notification
   */
  text?: string;
};
