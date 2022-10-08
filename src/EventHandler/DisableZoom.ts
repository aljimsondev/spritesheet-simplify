export function disableZoom(el: HTMLElement) {
  el.addEventListener(
    "wheel",
    (event) => {
      if (event.ctrlKey) {
        event.preventDefault();
        console.log("called");
      }
    },
    false
  );
}
