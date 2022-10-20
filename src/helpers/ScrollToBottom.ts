export const scrollToBottom = (node: HTMLElement) => {
  if (node) {
    console.log(node.scrollHeight);
    node.scrollTop = node.scrollHeight;
  }
};
