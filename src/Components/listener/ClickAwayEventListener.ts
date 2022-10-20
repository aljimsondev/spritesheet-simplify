import { ClickAwayEventListener } from "../../types/types";
interface ClickAwayListener {
  cb: () => void;
  ref: React.RefObject<any>;
  handler: (e: any) => void;
}

/**
 * @params ref - React reference that was the wrapper of the element
 * @params cb - function called when the event click is outside the element
 */
class ClickAwayListener {
  constructor(ref: React.RefObject<any>, cb: () => void) {
    this.ref = ref;
    this.cb = cb;
    this.handler = (e: any) => {
      if (ref.current === undefined || ref.current === null) {
        return;
      } else {
        if (!ref.current.contains(e.target)) {
          cb();
        }
      }
    };
    document.addEventListener("mousedown", this.handler);
  }
  /**
   * Remove handles the callback to be called it must be called when unmounting the element or the event click is outside the ref element
   */
  remove() {
    document.removeEventListener("mousedown", this.handler);
  }
}

export default ClickAwayListener;
