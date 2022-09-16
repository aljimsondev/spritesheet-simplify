import React from "react";
import ReactDOM from "react-dom";

export class Portal extends React.Component<{ children?: React.ReactNode }> {
  root: HTMLElement = document.body;
  el: HTMLElement = document.createElement("div");

  componentDidMount() {
    this.el.classList.add("--portal");
    this.root.appendChild(this.el);
  }

  componentWillUnmount() {
    this.root.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.el);
  }
}
