export const scrollToBottom = (node: HTMLElement) => {
  if (node) {
    node.scrollTop = node.scrollHeight;
  }
};
