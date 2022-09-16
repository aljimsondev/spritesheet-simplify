import { ClickAwayEventListener } from "../types";
interface ClickAwayListener {
  cb: () => void;
  ref: React.RefObject<any>;
  handler: (e: any) => void;
}

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

  remove() {
    document.removeEventListener("mousedown", this.handler);
  }
}

export default ClickAwayListener;
