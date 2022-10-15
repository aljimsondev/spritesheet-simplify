import Zoomify from "../Zoomify";

export function CanvasZoomDrag<T = HTMLDivElement>(targetEl: T) {
  const container = targetEl as HTMLDivElement;
  if (targetEl as HTMLDivElement) {
    const instance = Zoomify({
      minScale: 0.1,
      maxScale: 30,
      element: container,
      scaleSensitivity: 30,
    });
    container.addEventListener("wheel", (event) => {
      if (event.ctrlKey) {
        instance.zoom({
          deltaScale: Math.sign(event.deltaY) > 0 ? -1 : 1,
          x: event.pageX,
          y: event.pageY,
        });
      }
    });
    container.addEventListener("dblclick", () => {
      instance.panTo({
        originX: 0,
        originY: 0,
        scale: 1,
      });
    });
    container.addEventListener("mousemove", (event) => {
      event.preventDefault();
      if (!event.shiftKey) {
        return;
      }
      instance.panBy({
        originX: event.movementX,
        originY: event.movementY,
      });
    });
  }
}
