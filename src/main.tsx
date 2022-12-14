import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Store from "./Store/store";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Store>
      <App />
    </Store>
  </React.StrictMode>
);
